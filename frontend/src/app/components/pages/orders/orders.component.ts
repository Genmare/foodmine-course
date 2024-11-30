import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from 'app/services/order.service';
import { OrdersService } from 'app/services/orders.service';
import { TitleComponent } from '../../partials/title/title.component';
import { Observable, tap } from 'rxjs';
import { OrdersState } from 'app/shared/interfaces/IOrders';
import { AsyncPipe, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Order } from 'app/shared/models/Order';
import { NotFoundComponent } from '../../partials/not-found/not-found.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    NgClass,
    RouterLink,
    TitleComponent,
    NotFoundComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements AfterViewInit {
  filter = '';
  orders$: Observable<OrdersState>;
  orders: Order[] = [];
  allStatus: string[] = [];

  constructor(
    orderService: OrderService,
    ordersService: OrdersService,
    activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {
    // activatedRoute.params.subscribe((params) => {
    //   if (params.filter) this.filter = params.filter;
    // });

    // const orders$ = ordersService.state$.pipe();
    this.orders$ = ordersService.state$.pipe(
      tap(({ orders, allStatus }) => {
        this.orders = orders;
        this.allStatus = allStatus;
      }),
    );

    orderService.getAllStatus().subscribe((status) =>
      ordersService.dispatch({
        type: 'ALL_STATUS_FETCHED',
        payload: status,
      }),
    );
    activatedRoute.params.subscribe((params) => {
      this.filter = params.filter;

      orderService.getAll(this.filter).subscribe((orders) =>
        ordersService.dispatch({
          type: 'ORDERS_FETCHED',
          payload: orders,
        }),
      );
    });
    this.orders$ = ordersService.state$.pipe(
      tap(({ orders, allStatus }) => {
        this.orders = orders;
        this.allStatus = allStatus;
      }),
    );
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
