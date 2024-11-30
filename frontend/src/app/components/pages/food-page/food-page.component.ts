import { Component } from '@angular/core';
import { Food } from '../../../shared/models/food';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FoodService } from '../../../services/food.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';
import { StarRatingComponent } from 'app/components/partials/star-rating/star-rating.component';

@Component({
  selector: 'app-food-page',
  standalone: true,
  imports: [
    NotFoundComponent,
    NgIf,
    NgFor,
    RouterLink,
    CurrencyPipe,
    StarRatingComponent,
  ],
  templateUrl: './food-page.component.html',
  styleUrl: './food-page.component.css',
})
export class FoodPageComponent {
  food!: Food;

  constructor(
    activatedRoute: ActivatedRoute,
    foodService: FoodService,
    private cartService: CartService,
    private router: Router
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params.id)
        foodService.getFoodbyId(params.id).subscribe((serverFood) => {
          this.food = serverFood;
        });
    });
  }

  addToCart() {
    this.cartService.addToCart(this.food);
    this.router.navigateByUrl('/cart-page');
  }
}
