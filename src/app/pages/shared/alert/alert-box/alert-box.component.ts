import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AppAlert } from 'src/app/common/models/alert.model';
import { AlertService } from 'src/app/common/services/alert.service';


@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.scss']
})
export class AlertBoxComponent {
  @Input() type: string;
  @Input() className: string;
  visible = 'none';
  alertMsg: AppAlert = new AppAlert({text: '', title: '', type: 'none'});
  @Output() hide: EventEmitter<string> = new EventEmitter();

  constructor(private alert: AlertService) {
    this.alert.alert$.subscribe( alert => {
      this.alertMsg = alert;
      this.visible = this.alertMsg.type;
      console.log('time', this.alertMsg.time)
      if (this.alertMsg.time !== 0) {
        setTimeout(() => {
          this.visible = 'none';
        }, this.alertMsg.time);
      }
    });
  }

  _hide() {
    this.visible = 'none';
    this.hide.emit('none');
  }


}
