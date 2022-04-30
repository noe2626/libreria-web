import {NgModule} from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { AlertBoxComponent } from './alert/alert-box/alert-box.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AlertComponent,
    AlertBoxComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    AlertComponent,
    AlertBoxComponent,
  ]
})
export class SharedModule {
}
