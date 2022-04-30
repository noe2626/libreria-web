import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { PagesComponent } from './pages/pages.component';
import { routes as childroutes } from './pages/pages.routing';


export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'pages', component: PagesComponent, children: childroutes},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
