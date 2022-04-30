import { Component, OnInit } from '@angular/core';
import {Employees} from "../../../common/models/employees.model";
import {EmployeesService} from "../../../common/services/employees.service";
import {AlertService} from "../../../common/services/alert.service";

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit {


  Employees: Array<Employees> = new Array<Employees>();
  flagEmployees: boolean;
  idEmployee;
  nameEmployee;
  employeeLogged;
  admin: boolean;

  constructor(private employeesService: EmployeesService,
              private alertService: AlertService) {
    this.employeeLogged=localStorage.getItem('user_id');
    this.flagEmployees = false;
    this.getEmployees();
    if(localStorage.getItem('admin')==="true"){
      this.admin=true;
    }else{
      this.admin=false;
    }
  }

  getEmployees(){
    this.employeesService.allProviders().subscribe((response: any) => {
      this.Employees = response.data;
      this.Employees.reverse();
      console.log(response.data);
    }, (error) => {
      console.log(error);
    });
  }


  selectEmployee(id: number, name){
    this.idEmployee=id;
    this.nameEmployee=name;
  }

  // Metodo para eliminar un empleado
  delete() {
    this.employeesService.deleteEmployee(this.idEmployee).subscribe((response: any) => {
      console.log(response);
      const index = this.Employees.indexOf(this.Employees.find(data => data.id === this.idEmployee));
      this.Employees.splice(index, 1);
      this.alertService.show({text: 'Empleado eliminado correctamente', title: 'Registro Exitoso', type: 'success', time: 4000});
      }, (error) => {
      console.log(error);
      this.alertService.show({text: 'No se ha elminado el empleado', title: 'Registro Fallido', type: 'error', time: 4000});
    })
  }

  ngOnInit() {
  }
}
