import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Character } from 'src/app/core/models/character';
import { Movie } from 'src/app/core/models/movie';
import { Specie } from 'src/app/core/models/specie';
import { CharactersService } from 'src/app/core/services/characters.service';
import { MoviesService } from 'src/app/core/services/movies.service';
import { SpeciesService } from 'src/app/core/services/species.service';
import { StarshipsService } from 'src/app/core/services/starships.service';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDetailsComponent implements OnInit, OnDestroy {
  character: Character;
  characterMovies: string;
  characterSpecies: string;
  characterStarships: string;
  private characterId: number;
  private characterSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private charactersService: CharactersService,
    private speciesService: SpeciesService,
    private moviesService: MoviesService,
    private starshipsService: StarshipsService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.characterId = Number(this.route.snapshot.paramMap.get('id'));
    this.characterSubscription = this.charactersService.getCharacterById(this.characterId).subscribe((character: Character) => this.processCharacterInfo(character));
  }

  ngOnDestroy(): void {
    this.characterSubscription.unsubscribe();
  }

  private processCharacterInfo(character: Character): void {
    this.character = character;
    this.moviesService.getBunchOfMovies(this.character.films).pipe(take(1)).subscribe((data: Array<Movie>) => {
      this.characterMovies = data.map((movie: Movie) => movie.title).join(', ');
      this.cdr.detectChanges();
    });
    this.speciesService.getBunchOfSpecies(this.character.species).pipe(take(1)).subscribe((data: Array<Specie>) => {
      this.characterSpecies =  data.length ? data.map((specie: Specie) => specie.name).join(', ') : '-';
      this.cdr.detectChanges();
    });
    this.starshipsService.getBunchOfStarships(this.character.starships).pipe(take(1)).subscribe((data) => {
      this.characterStarships = data.length ? data.map((starship: any) => starship.name).join(', ') : '-';
      this.cdr.detectChanges();
    });
    this.cdr.detectChanges();
  }
}
