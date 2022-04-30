import { Component, OnInit } from '@angular/core';
import { Employees } from 'src/app/common/models/employees.model';
import { EmployeesService } from 'src/app/common/services/employees.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  admin: boolean;

  constructor() { 
    if(localStorage.getItem('admin')==="true"){
      this.admin=true;
    }else{
      this.admin=false;
    }
  }

  ngOnInit() {
  }

}
