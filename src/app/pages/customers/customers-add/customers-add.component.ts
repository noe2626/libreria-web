import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/common/services/customers.service';
import { Customer } from 'src/app/common/models/customer.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/common/services/alert.service';

@Component({
  selector: 'app-customers-add',
  templateUrl: './customers-add.component.html',
  styleUrls: ['./customers-add.component.scss']
})
export class CustomersAddComponent implements OnInit {

  customer: Customer;
  formData: FormGroup;

  constructor(private customers_ser: CustomersService, private formBuilder: FormBuilder, public router: Router,
              private alertService: AlertService) {
    this.formData = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  addCustomer() {
    this.customer = {
      nombre: this.formData.controls['nombre'].value,
      telefono: this.formData.controls['telefono'].value
    };

    this.customers_ser.addCustomer(this.customer).subscribe(
      (responce: any) => {
        this.formData.reset();
        this.router.navigate(['/pages/customers']);
        this.alertService.show({text: 'Cliente guardado correctamente', title: 'Registro Exitoso', type: 'success', time: 4000});
        console.log(responce);
      },
      err => {
        this.alertService.show({text: 'No ha guardado el cliente', title: 'Registro Fallido', type: 'error', time: 4000});
        console.log(err);
      }
    );
  }

}
