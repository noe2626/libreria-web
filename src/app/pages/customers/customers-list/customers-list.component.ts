import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/common/services/customers.service';
import { Customer } from 'src/app/common/models/customer.model';
import { AlertService } from 'src/app/common/services/alert.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {

  idCustomer: number;
  customers: Array<Customer> = new Array<Customer>();
  customersAll = new Array<Customer>();
  filter: string;
  admin: boolean;

  constructor(private customers_ser: CustomersService, 
    private alertService: AlertService) {
      if(localStorage.getItem('admin')==="true"){
        this.admin=true;
      }else{
        this.admin=false;
      }
     }

  ngOnInit() {
    this.getCustomers();
  }

  getCustomers() {
    this.customers_ser.getCustomers().subscribe(
      (responce: any) => {

        this.customers = responce.data;
        this.customersAll = responce.data;
        console.log('Data: ', this.customers);
      },
      err => {
        console.log('Error: ', err);
      }
    );
  }

  selectCustomer(id: number) {
    this.idCustomer = id;
  }

  deleteCustomer() {
    this.customers_ser.deleteCustomer(this.idCustomer).subscribe(
      (responce: any) => {
        this.getCustomers();
        this.alertService.show({text: 'Cliente borrado correctamente', title: 'Registro Exitoso', type: 'success', time: 4000});
        console.log(responce);
      },
      err => {
        this.alertService.show({text: 'No se pudo borrar el cliente', title: 'Registro Fallido', type: 'error', time: 4000});
        console.log(err);
      }
    );
  }

  search() {
    this.customers = new Array<Customer>();
    for (let i = 0; i < this.customersAll.length; i++) {
      const titleIndex = this.customersAll[i].nombre.toLowerCase().indexOf(this.filter.toLowerCase());
      if (titleIndex !== -1) {
        this.customers.push(this.customersAll[i]);
      }
    }
  }

}
