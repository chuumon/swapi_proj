import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Movie } from 'src/app/core/models/movie';
import { CharactersFilterService } from 'src/app/core/services/characters-filter.service';
import { MoviesService } from 'src/app/core/services/movies.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent implements OnInit, OnDestroy {
  movies: Movie[];
  filtersForm: FormGroup;
  private defaultMovie: number;
  private moviesSubscription: Subscription;

  constructor(
    private moviesService: MoviesService,
    private charactersFilterService: CharactersFilterService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      moviesControl: [''],
      speciesControl: ['', [Validators.minLength(3)]],
    });
    this.moviesSubscription = this.moviesService.getMoviesData().subscribe((movies: Movie[]) => this.processMovies(movies));
    this.filtersForm.get('speciesControl').valueChanges
      .pipe(debounceTime(500), map((value) => value.trim()), distinctUntilChanged()).subscribe((value: string) => this.onSpeciesInput(value));
  }

  ngOnDestroy(): void {
    this.moviesSubscription.unsubscribe();
  }

  filterByMovie(id: string | number): void {
    this.charactersFilterService.filterByMovie(Number(id));
  }

  private processMovies(movies: Movie[]): void {
    this.movies = movies;
    this.defaultMovie = this.movies[0].episode_id;
    this.filtersForm.get('moviesControl').setValue(this.movies[0].episode_id);
    this.filterByMovie(this.defaultMovie);
    this.cdr.detectChanges();
  }

  private onSpeciesInput(value: string): void {
    if (this.filtersForm.get('speciesControl').valid) {
      this.charactersFilterService.filterBySpecie(value);
    }
  }
}
