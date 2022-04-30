import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Provider} from "../models/provider.model";

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  SERVER = environment.API_ADMIN + 'proveedores';

  constructor(private httpClient: HttpClient) {

  }

  createProvider(data: Provider) {
    return this.httpClient.post(this.SERVER , data);
  }

  allProviders() {
    return this.httpClient.get(this.SERVER);
  }

  getProvider(id: number) {
    return this.httpClient.get(this.SERVER + '/' + id);
  }

  deleteProviders(id: number) {
    return this.httpClient.delete(this.SERVER + '/' + id);
  }

  editProvider(data: Provider) {
    return this.httpClient.put(this.SERVER + '/' + data.id, data);
  }

}
