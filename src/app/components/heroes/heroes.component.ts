import { Component, OnInit } from '@angular/core';

import { Hero } from '../../models/hero';

import { HeroService } from '../../services/hero/hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  add(heroName: string): void {
    const name = heroName.trim();
    if (!name) {
      return;
    }

    this.heroService.addHero({ name } as Hero).subscribe(hero => hero && this.heroes.push(hero));
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }
}
