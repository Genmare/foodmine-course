import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FoodService } from 'app/services/food.service';
import { Food } from 'app/shared/models/food';
import { TitleComponent } from '../../partials/title/title.component';
import { NotFoundComponent } from 'app/components/partials/not-found/not-found.component';
import { SearchComponent } from '../../partials/search/search.component';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-foods-admin',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    NotFoundComponent,
    TitleComponent,
    SearchComponent,
  ],
  templateUrl: './foods-admin.component.html',
  styleUrl: './foods-admin.component.css',
})
export class FoodsAdminComponent {
  foods: Food[] = [];
  searchTerm = '';

  constructor(
    private foodService: FoodService,
    activatedRoute: ActivatedRoute,
    private toast: ToastrService,
  ) {
    // this.searchTerm = activatedRoute.snapshot.queryParams.searchTerm;

    activatedRoute.params.subscribe(({ searchTerm }) => {
      this.searchTerm = searchTerm;
      if (this.searchTerm) {
        foodService
          .getAllFoodsBySearchTerm(this.searchTerm)
          .subscribe((foods) => (this.foods = foods));
      } else {
        foodService.getAll().subscribe((foods) => (this.foods = foods));
      }
    });
  }

  deleteFood(food: Food) {
    const confirmed = window.confirm(`Delete Food ${food.name}?`);
    if (!confirmed) return;

    this.foodService.deleteById(food.id);
    this.toast.success(`"${food.name}" Has Been Removed!`);
    this.foods = this.foods.filter((f) => f.id !== food.id);
  }
}
