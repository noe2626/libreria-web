import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  SERVER = environment.API_ADMIN;
  order: Order;

  constructor(private http: HttpClient) { }

  getOrders(){
    return this.http.get(this.SERVER + 'pedidos');
  }

  addOrder(order: Order){
    return this.http.post(this.SERVER+'pedidos', order);
  }

  setOrder(order: Order){
    this.order=order;
  }

  getOrder(){
    return this.order;
  }

  editOrder(id, order: Order){
    return this.http.put(this.SERVER+'pedidos/'+id, order);
  }

  deleteOrder(id){
    return this.http.delete(this.SERVER+'pedidos/'+id);
  }

  addTicket(ticket){
    return this.http.post(this.SERVER+'tickets',ticket);
  }

  addSale(sale){
    return this.http.post(this.SERVER+'ventas',sale);
  }

}
