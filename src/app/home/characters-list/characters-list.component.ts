import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from 'src/app/core/models/character';

@Component({
  selector: 'app-characters-list',
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersListComponent {
  @Input() characters: Array<Character>;

  constructor(
    private router: Router
  ) { }

  onCharacterSelect(character: Character): void {
    const characterId = character.url.match(/people\/(.+)\//)[1];
    this.router.navigate(['details', characterId]);
  }

}
