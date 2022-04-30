import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SelesService {

  SERVER = environment.API_ADMIN;

  constructor(private http: HttpClient) { }

  getSales() {
    return this.http.get(this.SERVER + 'ventas');
  }

  addTicket(ticket) {
    return this.http.post(this.SERVER + 'tickets', ticket);
  }

  addSale(sale) {
    return this.http.post(this.SERVER + 'ventas', sale);
  }

  deleteSale(id: number) {
    return this.http.delete(this.SERVER + 'ventas/' + id);
  }

  getReport(fecha_inicial, fecha_final) {
    return this.http.post(this.SERVER + 'ventasReporte', {
      fecha_inicial: fecha_inicial,
      fecha_final: fecha_final
    });
  }
}
