import { Component, OnInit } from '@angular/core';
import { Employees } from 'src/app/common/models/employees.model';
import { EmployeesService } from 'src/app/common/services/employees.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  employee: Employees=null;
  
  constructor(private service: EmployeesService,
    private router: Router) {
    this.employee=this.service.getEmployeeData();
    if(this.employee===null){
      let userId=parseInt(localStorage.getItem('user_id'),10);
      this.service.getEmployee(userId).subscribe((data:any)=>{
        this.employee=data.data;
      },error=>{
        this.router.navigate(['\login']);
      });
    }
  }

  ngOnInit() {
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
  }

}
