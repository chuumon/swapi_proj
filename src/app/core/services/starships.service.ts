import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Starship } from '../models/starship';

@Injectable({
  providedIn: 'root'
})
export class StarshipsService {

  constructor(
    private http: HttpClient,
  ) { }

  getBunchOfStarships(requestedStarships: string[]): Observable<Starship[]> {
    const starshipsObservables: Observable<Starship>[] = requestedStarships.map((starshipUrl: string): Observable<Starship>  => this.http.get<Starship>(starshipUrl));
    if (starshipsObservables?.length) {
      return forkJoin(starshipsObservables).pipe(
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
