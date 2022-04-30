import { Injectable } from '@angular/core';
import { AppAlert } from '../models/alert.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  // message: AppAlert = new AppAlert();
  private alertSub = new Subject<AppAlert>();
  public alert$ = this.alertSub.asObservable();

  show(msg: AppAlert) {
    this.alertSub.next(new AppAlert(msg));
  }
}
