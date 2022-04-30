import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/common/services/customers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from 'src/app/common/models/customer.model';
import { AlertService } from 'src/app/common/services/alert.service';

@Component({
  selector: 'app-customers-edit',
  templateUrl: './customers-edit.component.html',
  styleUrls: ['./customers-edit.component.scss']
})
export class CustomersEditComponent implements OnInit {

  customer: Customer;
  formData: FormGroup;
  idCustomer: number;

  constructor(private customers_ser: CustomersService, private formBuilder: FormBuilder, public router: Router,
              private activatedRoute: ActivatedRoute, private alertService: AlertService) {
    this.formData = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.required]]
    });

    this.activatedRoute.params.subscribe((params) => {
      this.idCustomer = params.id;
      this.getCustomer(this.idCustomer);
    });
  }

  ngOnInit() {
  }

  getCustomer(id: number) {
    this.customers_ser.getCustomer(id).subscribe(
      (responce: any) => {
        this.formData.controls['nombre'].setValue(responce.data.nombre);
        this.formData.controls['telefono'].setValue(responce.data.telefono);
        console.log(responce);
      },
      err => {
        console.log(err);
      }
    );
  }

  updateCustomer() {
    this.customer = {
      nombre: this.formData.controls['nombre'].value,
      telefono: this.formData.controls['telefono'].value
    };

    this.customers_ser.updateCustomer(this.customer, this.idCustomer).subscribe(
      (responce: any) => {
        this.formData.reset();
        this.router.navigate(['/pages/customers']);
        this.alertService.show({text: 'Cliente actualizado correctamente', title: 'Registro Exitoso', type: 'success', time: 4000});
        console.log(responce);
      },
      err => {
        this.alertService.show({text: 'No se actualizo el cliente', title: 'Registro Fallido', type: 'error', time: 4000});
        console.log(err);
      }
    );
  }

  /*cancel() {
    this.formData.reset();
    this.router.navigate(['/pages/customers']);
    this.alertService.show({text: 'Se cancelo la operación', title: 'Registro Cancelado', type: 'info', time: 4000});
  }*/

}
