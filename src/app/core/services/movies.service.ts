import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private movies: Array<Movie>;

  constructor(
    private http: HttpClient,
  ) { }

  getMoviesData(): Observable<Movie[]> {
    if (this.movies) {
      return of(this.movies);
    } else {
      return this.http.get<any>('https://swapi.dev/api/films/').pipe(
        map((data) => data.results), tap((data) => this.movies = data),
        catchError(err => {
          console.error(err);
          return of([]);
        })
      );
    }
  }

  getBunchOfMovies(requestedMovies: string[]): Observable<Movie[]> {
    const moviesObservables: Observable<any>[] = requestedMovies.map((characterUrl: string) => this.http.get(characterUrl));
    if (moviesObservables) {
      return forkJoin(moviesObservables).pipe(catchError(err => {
        console.error(err);
        return of([]);
      }));
    } else {
      return of([]);
    }
  }
}
