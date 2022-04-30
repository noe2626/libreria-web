export class AppAlert {
  title: string;
  text: string;
  time?: number;
  type?: 'none' | 'success' | 'error' | 'info' ;
  constructor(alert: AppAlert = {title: '', text: ''}) {
    this.title = alert.title;
    this.text = alert.text;
    this.time = alert.time || alert.time === 0 ? alert.time : 3000;
    this.type = alert.type ? alert.type : 'success';
  }
}

