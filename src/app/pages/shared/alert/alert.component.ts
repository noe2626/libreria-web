import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/common/services/alert.service';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  wait = 1;

  constructor(private alert: AlertService) {
    setTimeout(() => {
      this.wait--;
    }, 1 );
  }

  ngOnInit() {
  }

}
