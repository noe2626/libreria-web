import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../common/services/alert.service";
import {Employees} from "../../../common/models/employees.model";
import {EmployeesService} from "../../../common/services/employees.service";


@Component({
  selector: 'app-employees-edit',
  templateUrl: './employees-edit.component.html',
  styleUrls: ['./employees-edit.component.scss']
})
export class EmployeesEditComponent implements OnInit {


  formGroup: FormGroup;
  dataEmployee: Employees;
  flagEmployee: boolean;

  constructor(private formBuilder: FormBuilder,
              private activtedRoute: ActivatedRoute,
              private employeesService: EmployeesService,
              private router: Router,
              private alertService: AlertService) {

    this.formGroup = this.formBuilder.group({
      nombre : ['', [Validators.required]],
      usuario : ['', [Validators.required]],
      password : [],
      telefono : ['', [Validators.required]],
      domicilio : ['', [Validators.required]]
    });

    this.activtedRoute.params.subscribe((params) => {
      const employeeID = params.id;
      this.provider(employeeID);
    });
  }

  provider(id: number){
    this.employeesService.getEmployee(id).subscribe((response: any) => {
      this.dataEmployee = response.data;
      this.setData();
      this.flagEmployee = true;
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }

  setData(){
    this.formGroup.controls['nombre'].setValue(this.dataEmployee.nombre);
    this.formGroup.controls['usuario'].setValue(this.dataEmployee.usuario);
    this.formGroup.controls['telefono'].setValue(this.dataEmployee.telefono);
    this.formGroup.controls['domicilio'].setValue(this.dataEmployee.domicilio);

    if(this.dataEmployee.admin){
      var checkBox: any = document.getElementById("myCheck");
      checkBox.checked = true;
    }
  }

  onSubmit() {
    var checkBox: any = document.getElementById("myCheck");

    const data: Employees = {
      id: this.dataEmployee.id,
      nombre: this.formGroup.controls['nombre'].value,
      usuario: this.formGroup.controls['usuario'].value,
      password: this.formGroup.controls['password'].value,
      telefono: this.formGroup.controls['telefono'].value,
      domicilio: this.formGroup.controls['domicilio'].value,
      admin: checkBox.checked
    };

    console.log(data);
    

    this.employeesService.updateEmployee(data).subscribe((response: any) => {
      this.alertService.show({text: 'Empleado actualizado correctamente', title: 'Registro Exitoso', type: 'success', time: 4000});
      this.router.navigate(['/pages/employees']);
    }, (error) => {
      console.log(error);
      this.alertService.show({text: 'No se ha actualizado el empleado', title: 'Registro Fallido', type: 'error', time: 4000});
    });
  }

  ngOnInit() {
  }

}
