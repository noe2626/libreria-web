import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Invoice} from "../models/invoice.model";

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  SERVER = environment.API_ADMIN + 'facturas';

  constructor(private httpClient: HttpClient) {

  }


  allInvoices(){
    return this.httpClient.get(this.SERVER);
  }

  createInvoice(data: Invoice){
   return this.httpClient.post(this.SERVER, data);
  }

}
