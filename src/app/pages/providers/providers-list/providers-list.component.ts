import { Component, OnInit } from '@angular/core';
import {Provider} from "../../../common/models/provider.model";
import {ProvidersService} from "../../../common/services/providers.service";
import {AlertService} from "../../../common/services/alert.service";

@Component({
  selector: 'app-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss']
})
export class ProvidersListComponent implements OnInit {

  Providers: Array<Provider> = new Array<Provider>();
  flagProvider: boolean;
  providerId;
  providerName;

  constructor(private providersService: ProvidersService,
              private alertService: AlertService) {
    this.flagProvider = false;
    this.getProviders();
  }

  getProviders(){
    this.providersService.allProviders().subscribe((response: any) => {
      this.Providers = response.data;
      this.Providers.reverse();
      console.log(response.data);
    }, (error) => {
      console.log(error);
    });
  }

  selectProvider(id, name){
    this.providerId=id;
    this.providerName=name;
  }

  // Metodo para eliminar un proveedor
  delete() {
    this.providersService.deleteProviders(this.providerId).subscribe((response: any) => {
      console.log(response);
      const index = this.Providers.indexOf(this.Providers.find(data => data.id === this.providerId));
      this.Providers.splice(index, 1);
      this.alertService.show({text: 'Proveedor eliminado correctamente', title: 'Registro Exitoso', type: 'success', time: 4000});
      }, (error) => {
      console.log(error);
      this.alertService.show({text: 'No se ha eliminado el proveedor', title: 'Registro Fallido', type: 'error', time: 4000});
    })
  }

  ngOnInit() {
  }

}
