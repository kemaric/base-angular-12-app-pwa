import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';

import { Pokemon } from './pokemon.model';
import { PokemonService } from './pokemon-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'pk-items',
  template: `<h1 *ngIf="!(pokemon | async)">Loading...</h1>
  Gotta catchem all
  <ul class="list-view">
    <li *ngFor="let item of (pokemon | async); index as i;">
      <a [class.disabled]="item | canClick" [routerLink]="['/details', item.id]">
        <img src="{{ item.image() }}">
        <span>{{ item.formattedName() }}</span>
      </a>
    </li>
  </ul>`,
})
export class PokemonListComponent implements OnInit {
  pokemon: Observable<Pokemon[]>;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemon = this.pokemonService.list$();
  }
  canClick(pokemon) {
    console.count(`Can Click ${pokemon.name} [Function]`);
    return pokemon.id === 1;
  }
}

@Pipe({
  name: 'canClick',
})
export class CanClickPipe implements PipeTransform {
  transform(pokemon: any, ...args: any[]) {
    console.count(`Can Click ${pokemon.name} [Pipe]`);
    return pokemon.id === 1;
  }
}
