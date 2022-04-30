import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomersListComponent } from './customers/customers-list/customers-list.component';
import { CustomersAddComponent } from './customers/customers-add/customers-add.component';
import { CustomersEditComponent } from './customers/customers-edit/customers-edit.component';
import { BooksListComponent } from './books/books-list/books-list.component';
import { BooksAddComponent } from './books/books-add/books-add.component';
import { BooksEditComponent } from './books/books-edit/books-edit.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { OrdersAddComponent } from './orders/orders-add/orders-add.component';
import { AngularMaterialModule } from '../angular-material.module';
import { OrdersEditComponent } from './orders/orders-edit/orders-edit.component';
import { ProvidersAddComponent } from './providers/providers-add/providers-add.component';
import { ProvidersEditComponent } from './providers/providers-edit/providers-edit.component';
import { ProvidersListComponent } from './providers/providers-list/providers-list.component';
import { SharedModule } from './shared/shared.module';
import { PendingsListComponent } from './pendings/pendings-list/pendings-list.component';
import { PendingsAddComponent } from './pendings/pendings-add/pendings-add.component';
import { PendingsEditComponent } from './pendings/pendings-edit/pendings-edit.component';
import { BooksDetailsComponent } from './books/books-details/books-details.component';
import { EmployeesAddComponent } from './employees/employees-add/employees-add.component';
import { EmployeesEditComponent } from './employees/employees-edit/employees-edit.component';
import { EmployeesListComponent } from './employees/employees-list/employees-list.component';
import { SalesListComponent } from './sales-books/sales-list/sales-list.component';
import { SalesAddComponent } from './sales-books/sales-add/sales-add.component';
import { PurchasesListComponent } from './purchases/purchases-list/purchases-list.component';
import { PurchasesAddComponent } from './purchases/purchases-add/purchases-add.component';
import { SalesReportComponent } from './reports/sales-report/sales-report.component';
import { PurchasesReportComponent } from './reports/purchases-report/purchases-report.component';

@NgModule({
  declarations: [PagesComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    CustomersListComponent,
    CustomersAddComponent,
    CustomersEditComponent,
    ProvidersAddComponent,
    ProvidersEditComponent,
    ProvidersListComponent,
    BooksListComponent,
    BooksAddComponent,
    BooksEditComponent,
    OrdersListComponent,
    OrdersAddComponent,
    OrdersEditComponent,
    EmployeesAddComponent,
    EmployeesEditComponent,
    EmployeesListComponent,
    PendingsListComponent, 
    PendingsAddComponent, 
    PendingsEditComponent, 
    BooksDetailsComponent,
    SalesListComponent,
    SalesAddComponent,
    PurchasesListComponent,
    PurchasesAddComponent,
    SalesReportComponent,
    PurchasesReportComponent],

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FormsModule,
    SharedModule
  ]
})
export class PagesModule { }
