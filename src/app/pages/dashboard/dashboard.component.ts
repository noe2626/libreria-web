import { Component, OnInit, ViewChild } from '@angular/core';
import { SelesService } from 'src/app/common/services/seles.service';
import * as moment from 'moment';
import Chart from 'chart.js';
import { ReportSales } from 'src/app/common/models/reportSales.model';
import { Book } from 'src/app/common/models/book.model';
import { BooksService } from 'src/app/common/services/books.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('barCanvas2') barCanvas2;
  context: CanvasRenderingContext2D;
  lineChart = null;
  lineChart2 = null;

  salesArray: Array<any> = new Array<any>();

  arrayGroup: Array<ReportSales> = new Array<ReportSales>();
  dataDay: ReportSales;

  index: number;
  dataSearch: any;

  data = [0, 0, 0, 0, 0, 0, 0];
  ingresos = [0, 0, 0, 0, 0, 0, 0];
  books: Array<Book>;

  periodData = {
    minDate: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD HH:mm:ss'),
    maxDate: moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
  };

  labels = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

  constructor(private _sales: SelesService,
    private bookService: BooksService) { }

  ngOnInit() {
    this.getReport();
  }

  getReport() {
    this.chartOne();
    this.chartTwo();
    this._sales.getReport(this.periodData.minDate, this.periodData.maxDate).subscribe(
      (resp1: any) => {
        this.salesArray = this.transformGraphicData(resp1.data);
        this.bookService.getBooks().subscribe((resp: any) => {
          this.books = resp.data;
          this.filter();
        }, error => {
          console.log(error);
        });
        console.log(this.salesArray);
      }, err => {
        console.log(err);
      }
    );
  }

  filter() {
    for (let i = 0; i < this.salesArray.length; i++) {
      const indexBook = this.books.indexOf(this.books.find(data => data.id === this.salesArray[i].libro_id));
      if (indexBook !== -1) {
        this.salesArray[i].libro = this.books[indexBook].titulo;
      } else {
        this.salesArray[i].libro = 'No disponible';
      }
    }
    this.salesArray.reverse();
    this.groupData();

  }

  transformGraphicData(data) {
    return data.reduce((prev, next) => {
      return prev.concat(next.ventass);
    }, []).filter(d => d.value !== 0)
      .map(d => {
        return d;
      });
  }

  groupData() {
    this.arrayGroup.length = 0;
    if (this.salesArray.length === 1) {
      this.dataDay = {
        date: this.salesArray[0].created_at.substr(0, 10),
        ventas: 0,
        total: 0
      };
      this.validateDay(this.salesArray[0].cantidad, this.salesArray[0].total);
      this.arrayGroup.push(this.dataDay);
    } else {
      for (let i = 0; i < this.salesArray.length; i++) {
        if (i === 0) {
          this.dataDay = {
            date: this.salesArray[i].created_at.substr(0, 10),
            ventas: 0,
            total: 0
          };
          this.validateDay(this.salesArray[i].cantidad, this.salesArray[i].total);
          this.arrayGroup.push(this.dataDay);
          i++;
        }
        this.dataSearch = this.arrayGroup.filter(data => data.date === this.salesArray[i].created_at.substr(0, 10))[0];
        if (this.dataSearch === undefined) {
          this.dataDay = {
            date: this.salesArray[i].created_at.substr(0, 10),
            ventas: 0,
            total: 0
          };
          this.validateDay(this.salesArray[i].cantidad, this.salesArray[i].total);
          this.arrayGroup.push(this.dataDay);

        } else {
          // En esta parte entra si el objeto ya existe, por lo que solo actualizaremos la información.
          this.index = this.arrayGroup.indexOf(this.arrayGroup.find(data => data.date === this.dataSearch.date));
          this.validateDayOnly(this.salesArray[i].cantidad, this.salesArray[i].total, this.index);
        }
      }
    }
    console.log('Datos agrupados: ', this.arrayGroup);

    this.validateWeek();
    /*console.log('DATA: ', this.data);
    console.log('INGRESOS: ', this.ingresos);
    console.log('LABELS: ', this.labels);*/
  }

  validateDay(cant: number, value: number) {
    this.dataDay.ventas = cant;
    this.dataDay.total = value;
  }

  validateDayOnly(cant: number, value: number, index: number) {
    this.arrayGroup[index].ventas = this.arrayGroup[index].ventas + cant;
    this.arrayGroup[index].total = this.arrayGroup[index].total + value;
  }

  validateWeek() {
    for (let i = 0; i < 7; i++) {
      if (this.arrayGroup[i] !== undefined) {
        this.arrayGroup[i].date = this.validStringDate(this.arrayGroup[i].date);
        if (moment(this.arrayGroup[i].date).locale('es').format('dddd') === 'domingo') {
          console.log('domingo');
          this.data[0] = this.arrayGroup[i].ventas;
          this.ingresos[0] = this.arrayGroup[i].total;
        } else if (moment(this.arrayGroup[i].date).locale('es').format('dddd') === 'lunes') {
          console.log('lunes');
          this.data[1] = this.arrayGroup[i].ventas;
          this.ingresos[1] = this.arrayGroup[i].total;
        } else if (moment(this.arrayGroup[i].date).locale('es').format('dddd') === 'martes') {
          console.log('martes');
          this.data[2] = this.arrayGroup[i].ventas;
          this.ingresos[2] = this.arrayGroup[i].total;
        } else if (moment(this.arrayGroup[i].date).locale('es').format('dddd') === 'miércoles') {
          console.log('miercoles');
          this.data[3] = this.arrayGroup[i].ventas;
          this.ingresos[3] = this.arrayGroup[i].total;
        } else if (moment(this.arrayGroup[i].date).locale('es').format('dddd') === 'jueves') {
          console.log('jueves');
          this.data[4] = this.arrayGroup[i].ventas;
          this.ingresos[4] = this.arrayGroup[i].total;
        } else if (moment(this.arrayGroup[i].date).locale('es').format('dddd') === 'viernes') {
          console.log('viernes');
          this.data[5] = this.arrayGroup[i].ventas;
          this.ingresos[5] = this.arrayGroup[i].total;
        } else if (moment(this.arrayGroup[i].date).locale('es').format('dddd') === 'sábado') {
          console.log('sabado');
          this.data[6] = this.arrayGroup[i].ventas;
          this.ingresos[6] = this.arrayGroup[i].total;
        }
      } else {
        // this.data.push(0);
        // this.ingresos.push(0);
      }
    }
    this.chartOne();
    this.chartTwo();
  }

  private validStringDate(hour) {
    const fechaparsed = hour.split(' ');
    if (fechaparsed.length > 1) {
      fechaparsed[1] = fechaparsed[1].split(':').map((n) => ('0' + n).slice(-2)).join(':');
    }
    return fechaparsed.join(' ');
  }

  chartOne() {
    if (this.lineChart !== null) {
      this.lineChart.destroy();
    }
    const ctx = this.lineChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Libros vendidos',
          data: this.data,
          backgroundColor: 'rgba(0, 95, 33, 0.2)',
          borderColor: 'rgba(0, 95, 33, 1)',
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: Math.max(...this.data) / this.arrayGroup.length
            },
            scaleLabel: {
              display: true,
              labelString: 'Libros vendidos'
            }
          }]
        }
      }
    });
  }

  chartTwo() {
    if (this.lineChart2 !== null) {
      this.lineChart2.destroy();
    }
    const ctx = this.lineChart2 = new Chart(this.barCanvas2.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Ingresos por ventas (MXN)',
          data: this.ingresos,
          backgroundColor: 'rgba(0, 65, 95, 0.2)',
          borderColor: 'rgba(0, 65, 95, 1)',
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: Math.max(...this.ingresos) / this.arrayGroup.length
            },
            scaleLabel: {
              display: true,
              labelString: 'Ingresos por ventas (MXN)'
            }
          }]
        }
      }
    });
  }

}
