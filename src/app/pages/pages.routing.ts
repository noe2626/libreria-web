import {Routes} from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersListComponent } from './customers/customers-list/customers-list.component';
import { CustomersAddComponent } from './customers/customers-add/customers-add.component';
import { CustomersEditComponent } from './customers/customers-edit/customers-edit.component';
import { BooksListComponent } from './books/books-list/books-list.component';
import { BooksAddComponent } from './books/books-add/books-add.component';
import { BooksEditComponent } from './books/books-edit/books-edit.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { OrdersAddComponent } from './orders/orders-add/orders-add.component';
import { OrdersEditComponent } from './orders/orders-edit/orders-edit.component';
import {ProvidersListComponent} from "./providers/providers-list/providers-list.component";
import {ProvidersAddComponent} from "./providers/providers-add/providers-add.component";
import {ProvidersEditComponent} from "./providers/providers-edit/providers-edit.component";
import { PendingsListComponent } from './pendings/pendings-list/pendings-list.component';
import { PendingsAddComponent } from './pendings/pendings-add/pendings-add.component';
import { PendingsEditComponent } from './pendings/pendings-edit/pendings-edit.component';
import { BooksDetailsComponent } from './books/books-details/books-details.component';
import {EmployeesListComponent} from "./employees/employees-list/employees-list.component";
import {EmployeesAddComponent} from "./employees/employees-add/employees-add.component";
import {EmployeesEditComponent} from "./employees/employees-edit/employees-edit.component";
import { SalesListComponent } from './sales-books/sales-list/sales-list.component';
import { SalesAddComponent } from './sales-books/sales-add/sales-add.component';
import {PurchasesListComponent} from "./purchases/purchases-list/purchases-list.component";
import {PurchasesAddComponent} from "./purchases/purchases-add/purchases-add.component";
import { SalesReportComponent } from './reports/sales-report/sales-report.component';
import { PurchasesReportComponent } from './reports/purchases-report/purchases-report.component';


export const routes: Routes = [
    {path: 'home', component: DashboardComponent, data: {title: ''}},
    {path: 'customers', component: CustomersListComponent, data: {title: 'Clientes'}},
    {path: 'customers-add', component: CustomersAddComponent, data: {title: 'Nuevo cliente'}},
    {path: 'customers-edit/:id', component: CustomersEditComponent, data: {title: 'Editar cliente'}},
    {path: 'books', component: BooksListComponent, data: {title: 'Libros'}},
    {path: 'books-add', component: BooksAddComponent, data: {title: 'Nuevo libro'}},
    {path: 'books-edit/:id', component: BooksEditComponent, data: {title: 'Editar libro'}},
    {path: 'books-details/:id', component: BooksDetailsComponent, data: {title: 'Detalles de libro'}},
    {path: 'orders', component: OrdersListComponent, data: {title: 'Pedidos'}},
    {path: 'orders-add', component: OrdersAddComponent, data: {title: 'Nuevo pedido'}},
    {path: 'orders-edit', component: OrdersEditComponent, data: {title: 'Editar pedido'}},
    {path: 'providers', component: ProvidersListComponent, data: {title: 'Proveedores'}},
    {path: 'providers-add', component: ProvidersAddComponent, data: {title: 'Nuevo proveedor'}},
    {path: 'providers-edit/:id', component: ProvidersEditComponent, data: {title: 'Editar proveedor'}},
    {path: 'pendings', component: PendingsListComponent, data: {title: 'Pendientes'}},
    {path: 'pendings-add', component: PendingsAddComponent, data: {title: 'Nuevo Pendiente'}},
    {path: 'pendings-edit', component: PendingsEditComponent, data: {title: 'Editar Pendiente'}},
    {path: 'employees', component: EmployeesListComponent, data: {title: 'Empleados'}},
    {path: 'employees-add', component: EmployeesAddComponent, data: {title: 'Nuevo empleado'}},
    {path: 'employees-edit/:id', component: EmployeesEditComponent, data: {title: 'Editar empleado'}},
    {path: 'sales', component: SalesListComponent, data: {title: 'Ventas'}},
    {path: 'sales-add', component: SalesAddComponent, data: {title: 'Nueva venta'}},
    {path: 'purchases', component: PurchasesListComponent, data: {title: 'Compras'}},
    {path: 'purchases-add', component: PurchasesAddComponent, data: {title: 'Nueva compra'}},
    {path: 'sales-report', component: SalesReportComponent, data: {title: 'Reporte ventas'}},
    {path: 'purchases-report', component: PurchasesReportComponent, data: {title: 'Reporte ventas'}}

    ];


