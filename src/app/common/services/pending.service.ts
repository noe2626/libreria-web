import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pending } from '../models/pending.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PendingService {

  SERVER = environment.API_ADMIN;
  pending: Pending= null;

  constructor(private http: HttpClient) { }

  getPendings(){
    return this.http.get(this.SERVER + 'pendientes');
  }

  deletePending(id){
    return this.http.delete(this.SERVER+'pendientes/'+id);
  }

  addTicket(ticket){
    return this.http.post(this.SERVER+'tickets',ticket);
  }

  addSale(sale){
    return this.http.post(this.SERVER+'ventas',sale);
  }

  addPending(pending: Pending){
    return this.http.post(this.SERVER+'pendientes', pending);
  }

  setPending(pending: Pending){
    this.pending=pending;
  }

  getPending(){
    return this.pending;
  }

}
