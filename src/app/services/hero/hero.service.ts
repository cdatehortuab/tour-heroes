import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { MessageService } from '../message/message.service';
import { Hero } from '../../models/hero';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation: string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  addHero(hero: Hero): Observable<Hero> {
    this.log('adding hero');
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(newHero => this.log(`added hero with id=${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero')),
      );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    this.log(`deleting hero id=${id}`);
    return this.http.delete<Hero>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>(`deleteHero id=${id}`)),
      );
  }

  getHeroes(): Observable<Hero[]>  {
    this.log('fetching heroes');
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', [])),
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    this.log(`fetching hero id=${id}`);
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`)),
      );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    const trimTerm = term.trim();
    if (!trimTerm) {
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}?name=${trimTerm}`)
      .pipe(
        tap(heroes => this.log(`found heroes matching "${term}": ${heroes.length}`)),
        catchError(this.handleError<Hero[]>(`searchHeroes "${term}"`, [])),
      );
  }

  updateHero(hero: Hero): Observable<any> {
    const { id } = hero;
    const url = `${this.heroesUrl}/${id}`;
    this.log(`updating hero id=${id}`);

    return this.http.put(url, hero, httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero id=${id}`)),
        catchError(this.handleError<any>(`updateHero id=${id}`)),
      );
  }
}
