import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Pokemon } from './pokemon.model';
import { PokemonService } from './pokemon-service';
import { tap, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'pk-details',
  template: `
  <ng-container *ngIf="pokemon$ | async as pokemon; else loading">
  <h1>{{ pokemon?.formattedName() || 'Loading...' }}</h1>

  <div *ngIf="pokemon?.name" class="details-container">
    <img src="{{ pokemon?.image() }}">
  
    <h4>Types:</h4>
    <ul>
      <li *ngFor="let type of pokemon?.types">
        {{ type }}
      </li>
    </ul>
  value {{pokemon?.value}}
    <h4>Stats:</h4>
    <ul>
      <li *ngFor="let stat of pokemon?.stats">
        {{ stat.name }}: {{ stat.value }}
      </li>
    </ul>
  </div> </ng-container>
  <ng-template #loading>'Loading...'</ng-template>
  `,
})
export class PokemonDetailComponent implements OnInit {
  pokemon$: Observable<SaulPokemon>;
  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id$: Observable<number> = this.route.params.pipe(
      map((params) => params['id'])
    );

    this.pokemon$ = id$.pipe(
      switchMap((id) => this.pokemonService.get(id)),
      this.addName,
      tap((p) => console.log(`Got details of ${p.formattedName()}`, p))
    );
  }

  addName(obs: Observable<Pokemon>) {
    return obs.pipe(
      map((p) => {
        (p as SaulPokemon).value = ' Saul';
        p.name += '- ***';
        return p as SaulPokemon;
      })
    );
  }
}

type SaulPokemon = Pokemon & { value: any };
