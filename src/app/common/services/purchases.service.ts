import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Provider} from "../models/provider.model";
import {Purchase} from "../models/purchase.model";

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {

  SERVER = environment.API_ADMIN + 'compras';

  constructor(private httpClient: HttpClient) {

  }

  allPurchases() {
    return this.httpClient.get(this.SERVER);
  }

  createPurchases(data: Purchase){
   return this.httpClient.post(this.SERVER, data);
  }

  deletePurchase(id){
    return this.httpClient.delete(this.SERVER + '/'+id);
  }

  getReport(fecha_inicial, fecha_final) {
    return this.httpClient.post(environment.API_ADMIN + 'comprasReporte', {
      fecha_inicial: fecha_inicial,
      fecha_final: fecha_final
    });
  }


}
