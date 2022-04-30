import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Customer} from "../models/customer.model";
import {Employees} from "../models/employees.model";

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  employee: Employees=null;

  SERVER = environment.API_ADMIN;

  constructor(private http: HttpClient) { }

  allProviders() {
    return this.http.get<Array<Customer>>(this.SERVER + 'empleados');
  }

  getEmployee(id: number) {
    return this.http.get<Customer>(this.SERVER + 'empleados/' + id);
  }

  createEmployee(employees: Employees) {
    return this.http.post(this.SERVER + 'empleados', employees);
  }

  updateEmployee(employees: Employees) {
    return this.http.put(this.SERVER + 'empleados/' + employees.id, employees);
  }

  deleteEmployee(id: number) {
    return this.http.delete<Customer>(this.SERVER + 'empleados/' + id);
  }

  login(data){
    return this.http.post(this.SERVER + 'loginEmpleado', data);
  }

  setEmployee(employee: Employees){
    this.employee=employee;
  }

  getEmployeeData(){
    return this.employee;
  }

}
