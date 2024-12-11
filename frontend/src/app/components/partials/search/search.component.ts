import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  searchTerm = '';
  @Input()
  searchRoute = '/search/';

  @Input()
  defaultRoute = '/';

  @Input()
  margin!: string;

  @Input()
  placeholder = 'Search Food Mine!';

  constructor(
    activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) this.searchTerm = params.searchTerm;
    });
  }

  search(term: string): void {
    if (term) this.router.navigateByUrl(this.searchRoute + term);
    else this.router.navigateByUrl(this.defaultRoute);
  }
}
