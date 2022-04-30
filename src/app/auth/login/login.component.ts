import { Component, OnInit } from '@angular/core';
import { EmployeesService } from 'src/app/common/services/employees.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AlertService } from 'src/app/common/services/alert.service';
import { Router } from '@angular/router';
import { Employees } from 'src/app/common/models/employees.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formData: FormGroup;
  incorrect: boolean= false;
  employee: Employees;

  constructor(private service: EmployeesService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router) { 
    this.formData = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }

  ngOnInit() {
  }

  login(){
    let username=this.formData.controls['username'].value;
    let password=this.formData.controls['password'].value;
    this.service.login({usuario: username, password: password}).subscribe((data:any)=>{
      this.employee=data.data[0];
      this.service.setEmployee(this.employee);
      localStorage.setItem('user',this.employee.usuario);
      localStorage.setItem('user_id',this.employee.id.toString());
      if(this.employee.admin){
        localStorage.setItem('admin','true');
      }else{
        localStorage.setItem('admin','false');
      }
      this.router.navigate(['pages/home']);
    },error=>{
      this.incorrect=true;
      this.formData.reset();
      console.log(error);
    });
  }

}
