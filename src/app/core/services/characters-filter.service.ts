import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Movie } from '../models/movie';
import { Specie } from '../models/specie';
import { CharactersService } from './characters.service';
import { MoviesService } from './movies.service';
import { SpeciesService } from './species.service';

@Injectable({
  providedIn: 'root'
})
export class CharactersFilterService implements OnDestroy {

  private moviesSubscription: Subscription;
  private movies: Movie[];
  private selectedMovie: Movie;
  private charactersBelontToSpeciesLinks: string[];
  private charactersBelontToMovieLinks: string[];

  constructor(
    private moviesService: MoviesService,
    private charactersService: CharactersService,
    private speciesService: SpeciesService,
  ) {
    this.moviesSubscription = this.moviesService.getMoviesData().subscribe((movies: Movie[]) => this.movies = movies);
  }

  ngOnDestroy(): void {
    this.moviesSubscription.unsubscribe();
  }

  filterByMovie(id: number): void {
    const episodeId = Number(id);
    this.selectedMovie = this.movies.find((movie: Movie) => episodeId === movie.episode_id);
    this.charactersBelontToMovieLinks = this.selectedMovie.characters;
    this.filterCharacters();
  }

  filterBySpecie(searchValue: string): void {
    if (searchValue.length) {
      this.speciesService.getSpesies(searchValue).subscribe((data: Specie[]) => {
        this.charactersBelontToSpeciesLinks = data.flatMap((specie) => specie.people);
        this.filterCharacters();
      });
    } else {
      this.charactersBelontToSpeciesLinks = null;
      this.filterCharacters();
    }
  }

  private filterCharacters(): void {
    let filteredCharactersLinks: string[];
    filteredCharactersLinks = this.charactersBelontToMovieLinks.filter((character) => {
      if (this.charactersBelontToSpeciesLinks) {
        return this.charactersBelontToSpeciesLinks.indexOf(character) !== -1;
      } else {
        return character;
      }
    });
    this.charactersService.requestBunchOfCharacters(filteredCharactersLinks);
  }
}
