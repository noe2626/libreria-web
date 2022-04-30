import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {EmployeesService} from "../../../common/services/employees.service";
import {Employees} from "../../../common/models/employees.model";
import {AlertService} from "../../../common/services/alert.service";

@Component({
  selector: 'app-employees-add',
  templateUrl: './employees-add.component.html',
  styleUrls: ['./employees-add.component.scss']
})
export class EmployeesAddComponent implements OnInit {

  formGroup: FormGroup;
  account: string;

  constructor(private formBuilder: FormBuilder,
              private employeesService: EmployeesService,
              private router: Router,
              private alertService: AlertService) {

    this.formGroup = this.formBuilder.group({
      nombre : ['', [Validators.required]],
      usuario : ['', [Validators.required]],
      password : ['', [Validators.required]],
      telefono : ['', [Validators.required]],
      domicilio : ['', [Validators.required]]
    });
  }


  onSubmit() {
    var checkBox: any = document.getElementById("myCheck");

    const data: Employees = {
      nombre: this.formGroup.controls['nombre'].value,
      usuario: this.formGroup.controls['usuario'].value,
      password: this.formGroup.controls['password'].value,
      telefono: this.formGroup.controls['telefono'].value,
      domicilio: this.formGroup.controls['domicilio'].value,
      admin: checkBox.checked
    };

    this.employeesService.createEmployee(data).subscribe((response: any) => {
      this.alertService.show({text: 'Empleado guardado correctamente', title: 'Registro Exitoso', type: 'success', time: 4000});
      this.router.navigate(['/pages/employees']);
    }, (error) => {
      console.log(error);
      this.alertService.show({text: 'No se ha guardado el empleado', title: 'Registro Fallido', type: 'error', time: 4000});
    });
  }


   ngOnInit() {
  }

}
