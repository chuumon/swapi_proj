import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Character } from '../models/character';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {
  charactersData$: Subject<Character[]> = new Subject<Character[]>();
  private characters: Character[];

  constructor(
    private http: HttpClient,
  ) { }

  requestBunchOfCharacters(requestedCharacters: string[]): Observable<Character[]> {
    if (requestedCharacters?.length) {
      const charactersObservables: Observable<Character>[] = requestedCharacters.map((characterUrl: string): Observable<Character> => this.http.get<Character>(characterUrl));
      forkJoin(charactersObservables)
      .pipe(catchError(err => {
        console.error(err);
        return of([]);
      }))
      .subscribe((results: Character[]) => {
        this.characters = results;
        this.charactersData$.next(results);
      });
    } else {
      this.charactersData$.next([]);
    }
    return this.charactersData$;
  }

  getCharacterById(id: number): Observable<Character> {
    const currentCharacter = this.characters?.find((character: Character) => Number(character.url.match(/people\/(.+)\//)[1]) === id);
    if (currentCharacter) {
      return of(currentCharacter);
    } else {
      return this.http.get<Character>(`https://swapi.dev/api/people/${id}`).pipe(catchError(err => {
        console.error(err);
        return throwError(err);
      }));
    }
  }
}
