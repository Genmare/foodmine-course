import { Order } from '../models/Order';

export interface OrdersState {
  allStatus: string[];
  orders: Order[];
}

export type OrdersAction =
  | { type: 'ALL_STATUS_FETCHED'; payload: any[] }
  | { type: 'ORDERS_FETCHED'; payload: any[] };
