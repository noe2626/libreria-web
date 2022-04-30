import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  SERVER = environment.API_ADMIN;

  constructor(private http: HttpClient) { }

  getCustomers() {
    return this.http.get<Array<Customer>>(this.SERVER + 'clientes');
  }

  getCustomer(id: number) {
    return this.http.get<Customer>(this.SERVER + 'clientes/' + id);
  }

  addCustomer(customers: Customer) {
    return this.http.post(this.SERVER + 'clientes', {
      nombre: customers.nombre,
      telefono: customers.telefono
    });
  }

  updateCustomer(customers: Customer, id: number) {
    return this.http.put(this.SERVER + 'clientes/' + id, {
      nombre: customers.nombre,
      telefono: customers.telefono
    });
  }

  deleteCustomer(id: number) {
    return this.http.delete<Customer>(this.SERVER + 'clientes/' + id);
  }
}
