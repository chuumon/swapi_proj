import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Specie } from '../models/specie';

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {

  constructor(
    private http: HttpClient,
  ) { }

  getSpesies(searchValue: string): Observable<Specie[]> {
    return this.http.get<any>(`https://swapi.dev/api/species/?search=${searchValue}`).pipe(
      map((data: any) => data.results),
      catchError(err => {
        console.error(err);
        return of([]);
      })
    );
  }

  getBunchOfSpecies(requestedSpecies: string[]): Observable<Specie[]> {
    const speciesObservables: Observable<Specie>[] = requestedSpecies.map((characterUrl: string): Observable<Specie>  => this.http.get<Specie>(characterUrl));
    if (speciesObservables.length) {
      return forkJoin(speciesObservables).pipe(
        catchError(err => {
          console.error(err);
          return of([]);
        })
      );
    } else {
      return of([]);
    }
  }
}
