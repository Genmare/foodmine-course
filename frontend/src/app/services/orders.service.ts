import { Injectable } from '@angular/core';
import { OrdersAction, OrdersState } from 'app/shared/interfaces/IOrders';
import { BehaviorSubject, scan } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private initialState: OrdersState = { allStatus: [], orders: [] };
  private actions$ = new BehaviorSubject<OrdersAction>({
    type: 'ALL_STATUS_FETCHED',
    payload: [],
  });

  public state$ = this.actions$.pipe(
    scan(
      (state, action) => this.ordersReducer(state, action),
      this.initialState
    )
  );

  ordersReducer(state: OrdersState, action: OrdersAction): OrdersState {
    const { type, payload } = action;
    switch (type) {
      case 'ALL_STATUS_FETCHED':
        return { ...state, allStatus: payload };
      case 'ORDERS_FETCHED':
        return { ...state, orders: payload };

      default:
        return state;
    }
  }

  dispatch(action: OrdersAction) {
    this.actions$.next(action);
  }
}
