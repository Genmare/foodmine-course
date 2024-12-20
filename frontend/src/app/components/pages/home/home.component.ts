import { Component } from '@angular/core';
import { Food } from '../../../shared/models/food';
import { FoodService } from '../../../services/food.service';
import { CurrencyPipe, NgFor } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SearchComponent } from '../../partials/search/search.component';
import { TagsComponent } from '../../partials/tags/tags.component';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';
import { Observable } from 'rxjs';
import { StarRatingComponent } from 'app/components/partials/star-rating/star-rating.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgFor,
    RouterLink,
    CurrencyPipe,
    NotFoundComponent,
    SearchComponent,
    StarRatingComponent,
    TagsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  foods: Food[] = [];

  constructor(
    private foodService: FoodService,
    activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe((params) => {
      let foodsObservable: Observable<Food[]>;
      if (params.searchTerm)
        foodsObservable = this.foodService.getAllFoodsBySearchTerm(
          params.searchTerm
        );
      else if (params.tag)
        foodsObservable = this.foodService.getAllFoodsByTag(params.tag);
      else foodsObservable = foodService.getAll();

      foodsObservable.subscribe((serverFoods) => {
        this.foods = serverFoods;
      });
    });
  }
}
