import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Pokemon } from './pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  constructor(private http: HttpClient) {}

  /**
   *
   *
   * Use Observables instead!
   */
  list$(): Observable<Pokemon[]> {
    const HTTP_OPTIONS = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http
      .get('https://pokeapi.co/api/v2/pokedex/2/', HTTP_OPTIONS)
      .pipe(
        map((data: any) => {
          let allPokemon = [];
          data.pokemon_entries.forEach((entry) => {
            let pokemon = new Pokemon();
            pokemon.name = entry.pokemon_species.name;
            pokemon.id = entry.entry_number;
            allPokemon.push(pokemon);
          });
          return allPokemon;
        }),
        shareReplay()
      );
  }

  get(id: number) {
    const HTTP_OPTIONS = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http
      .get('https://pokeapi.co/api/v2/pokemon/' + id + '/', HTTP_OPTIONS)
      .pipe(
        map((data: any) => {
          let pokemon = new Pokemon();
          pokemon.name = data.name;
          pokemon.id = data.id;

          data.types.forEach((eachType) => {
            pokemon.types.push(eachType.type.name);
          });

          data.stats.forEach((eachStat) => {
            pokemon.stats.push({
              name: eachStat.stat.name,
              value: eachStat.base_stat,
            });
          });

          return pokemon;
        })
      );
  }

  // private handleError(error: Response | any) {
  //   let errMsg: string;
  //   if (error instanceof Response) {
  //     const body = error.json() || '';
  //     const err = body.error || JSON.stringify(body);
  //     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  //   } else {
  //     errMsg = error.message ? error.message : error.toString();
  //   }
  //   console.error(errMsg);
  //   return Promise.reject(errMsg);
  // }
}
