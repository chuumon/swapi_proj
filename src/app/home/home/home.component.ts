import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from 'src/app/core/models/character';
import { CharactersService } from 'src/app/core/services/characters.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  characters: Observable<Character[]>;
  pagesAmount: Observable<number>;
  activePage: number;

  constructor(
    private charactersService: CharactersService,
  ) { }

  ngOnInit(): void {
    this.characters = this.charactersService.charactersData$;
  }
}
