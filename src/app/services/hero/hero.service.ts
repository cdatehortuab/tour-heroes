import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';

import { MessageService } from '../message/message.service';
import { Hero } from '../../models/hero';
import { HEROES } from '../../data/mock-heroes';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessageService) { }

  getHero(id: number): Observable<Hero> {
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(HEROES.find(hero => hero.id === id));
  }

  getHeroes(): Observable<Hero[]>  {
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);
  }
}
