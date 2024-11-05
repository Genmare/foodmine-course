import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { Food } from '../../../shared/models/food';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FoodService } from '../../../services/food.service';
import {
  StarRatingComponent,
  StarRatingModule,
  StarRatingUtils,
} from 'angular-star-rating';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';

@Component({
  selector: 'app-food-page',
  standalone: true,
  imports: [
    NotFoundComponent,
    StarRatingModule,
    NgIf,
    NgFor,
    RouterLink,
    CurrencyPipe,
  ],
  templateUrl: './food-page.component.html',
  styleUrl: './food-page.component.css',
})
export class FoodPageComponent implements AfterViewInit {
  @ViewChild('whithHalfStar') private whithHalfStar?: StarRatingComponent;

  food!: Food;

  constructor(
    private cdr: ChangeDetectorRef,
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

  ngAfterViewInit(): void {
    if (this.whithHalfStar) {
      this.whithHalfStar.getHalfStarVisible =
        StarRatingUtils.getHalfStarVisible;
      this.whithHalfStar.setHalfStarVisible();
      this.cdr.detectChanges();
    }
  }

  addToCart() {
    this.cartService.addToCart(this.food);
    this.router.navigateByUrl('/cart-page');
  }
}
