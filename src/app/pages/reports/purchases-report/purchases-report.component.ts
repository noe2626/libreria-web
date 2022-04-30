import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchasesService } from 'src/app/common/services/purchases.service';
import { BooksService } from 'src/app/common/services/books.service';
import { Book } from 'src/app/common/models/book.model';
import { Employees } from 'src/app/common/models/employees.model';
import { AlertService } from 'src/app/common/services/alert.service';
import { ProvidersService } from 'src/app/common/services/providers.service';
import { ReportPurchases } from 'src/app/common/models/reportPurchases.model';
import { ReportBooksPurchases } from 'src/app/common/models/reportBooksPurchases.model';
import Chart from 'chart.js';
import { ReportProvider } from 'src/app/common/models/reportProvider.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-purchases-report',
  templateUrl: './purchases-report.component.html',
  styleUrls: ['./purchases-report.component.scss']
})
export class PurchasesReportComponent implements OnInit {

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('barCanvas2') barCanvas2;
  context: CanvasRenderingContext2D;
  lineChart = null;
  lineChart2 = null;

  formData: FormGroup;
  purchasesArray: Array<any> = new Array<any>();
  allPurchasesArray: Array<any> = new Array<any>();
  books: Array<Book> = new Array<Book>();
  providers: Array<Employees> = new Array<Employees>();

  arrayData: Array<any> = new Array<any>();

  arrayGroup: Array<ReportPurchases> = new Array<ReportPurchases>();
  dataDay: ReportPurchases;

  arrayBooks: Array<ReportBooksPurchases> = new Array<ReportBooksPurchases>();
  dataBook: ReportBooksPurchases;

  arrayProviders: Array<ReportProvider> = new Array<ReportProvider>();
  dataProvider: ReportProvider;

  dataSearch: any;
  dataSearchBook: any;
  dataSearchProvider: any;

  index: number;
  indexBook: number;
  indexPriver: number;

  data: Array<any> = new Array<any>();
  labels: Array<any> = new Array<any>();
  egresos: Array<any> = new Array<any>();

  constructor(private formBuilder: FormBuilder, private _purchases: PurchasesService, private bookService: BooksService,
    private providersService: ProvidersService, private alertService: AlertService) {
    this.formData = this.formBuilder.group({
      fecha_inicial: ['', [Validators.required]],
      fecha_final: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  getReport() {
    this.arrayBooks.length = 0;
    this.arrayProviders.length = 0;
    // console.log(this.formData.value);
    this._purchases.getReport(this.formData.controls['fecha_inicial'].value + ' 00:00:00',
      this.formData.controls['fecha_final'].value + ' 23:59:59').subscribe(
        (resp: any) => {
          console.log(resp);
          this.purchasesArray = resp.data;
          if (this.purchasesArray.length > 0) {
            this.bookService.getBooks().subscribe((data: any) => {
              console.log(data);
              this.books = data.data;
              this.providersService.allProviders().subscribe((response: any) => {
                console.log(response);
                this.providers = response.data;
                // this.formData.reset();
                this.filter();
                this.groupProvider();
                // console.log(response.data);
              }, (error) => {
                console.log(error);
              });
            }, error => {
              console.log(error);
            });
          } else {
            this.alertService.show({ text: 'No existen datos entre las fechas', title: 'Consulta fallida', type: 'error', time: 4000 });
          }
        }, err => {
          console.log(err);
        }
      );
  }

  filter() {
    for (let i = 0; i < this.purchasesArray.length; i++) {

      const indexProvider = this.providers.indexOf(this.providers.find(data => data.id === this.purchasesArray[i].factura.proveedor_id));
      if (indexProvider !== -1) {
        this.purchasesArray[i].factura.proveedor = this.providers[indexProvider].nombre;
      } else {
        this.purchasesArray[i].factura.proveedor = 'No disponible';
      }

      for (let index = 0; index < this.purchasesArray[i].compras.length; index++) {
        const indexBook = this.books.indexOf(this.books.find(data => data.id === this.purchasesArray[i].compras[index].libro_id));
        if (indexBook !== -1) {
          this.purchasesArray[i].compras[index].libro = this.books[indexBook].titulo;
        } else {
          this.purchasesArray[i].compras[index].libro = 'No disponible';
        }

      }
    }
    console.log(this.purchasesArray);
    this.allPurchasesArray = this.purchasesArray;
    this.arrayData = this.transformGraphicData(this.purchasesArray);
    console.log('***: ', this.arrayData);
    this.groupData();
  }

  transformGraphicData(data) {
    return data.reduce((prev, next) => {
      return prev.concat(next.compras);
    }, []).filter(d => d.value !== 0)
      .map(d => {
        return d;
      });
  }

  transformDataCompras(data) {
    return data.reduce((prev, next) => {
      return prev.concat(next.compras);
    }, []).filter(d => d.value !== 0)
      .map(d => {
        return d;
      });
  }

  transformDataIngresos(data) {
    return data.reduce((prev, next) => {
      return prev.concat(next.total);
    }, []).filter(d => d.value !== 0)
      .map(d => {
        return d;
      });
  }

  transformDataDays(data) {
    return data.reduce((prev, next) => {
      return prev.concat(next.date);
    }, []).filter(d => d.value !== 0)
      .map(d => {
        return d;
      });
  }

  groupData() {
    this.arrayGroup.length = 0;
    this.arrayBooks.length = 0;
    if (this.arrayData.length === 1) {

      // por fecha
      this.dataDay = {
        date: this.arrayData[0].created_at.substr(0, 10),
        compras: 0,
        total: 0
      };
      this.validateDay(this.arrayData[0].cantidad, this.arrayData[0].total);
      this.arrayGroup.push(this.dataDay);
      // por fecha

      // por libro
      this.dataBook = {
        libro: this.arrayData[0].libro,
        compras: 0
      };
      this.validateBook(this.arrayData[0].cantidad);
      this.arrayBooks.push(this.dataBook);
      // por libro

    } else {
      for (let i = 0; i < this.arrayData.length; i++) {
        if (i === 0) {

          // por fecha
          this.dataDay = {
            date: this.arrayData[i].created_at.substr(0, 10),
            compras: 0,
            total: 0
          };
          this.validateDay(this.arrayData[i].cantidad, this.arrayData[i].total);
          this.arrayGroup.push(this.dataDay);
          // por fecha

          // por libro
          this.dataBook = {
            libro: this.arrayData[i].libro,
            compras: 0
          };
          this.validateBook(this.arrayData[i].cantidad);
          this.arrayBooks.push(this.dataBook);
          // por libro

          i++;
        }

        // por fecha
        this.dataSearch = this.arrayGroup.filter(data => data.date === this.arrayData[i].created_at.substr(0, 10))[0];

        if (this.dataSearch === undefined) {

          this.dataDay = {
            date: this.arrayData[i].created_at.substr(0, 10),
            compras: 0,
            total: 0
          };
          this.validateDay(this.arrayData[i].cantidad, this.arrayData[i].total);
          this.arrayGroup.push(this.dataDay);

        } else {
          // En esta parte entra si el objeto ya existe, por lo que solo actualizaremos la información.
          this.index = this.arrayGroup.indexOf(this.arrayGroup.find(data => data.date === this.dataSearch.date));
          this.validateDayOnly(this.arrayData[i].cantidad, this.arrayData[i].total, this.index);
        }
        // por fecha

        // por libro
        this.dataSearchBook = this.arrayBooks.filter(data => data.libro === this.arrayData[i].libro)[0];

        if (this.dataSearchBook === undefined) {

          this.dataBook = {
            libro: this.arrayData[i].libro,
            compras: 0
          };
          this.validateBook(this.arrayData[i].cantidad);
          this.arrayBooks.push(this.dataBook);

        } else {
          // En esta parte entra si el objeto ya existe, por lo que solo actualizaremos la información.
          this.indexBook = this.arrayBooks.indexOf(this.arrayBooks.find(data => data.libro === this.dataSearchBook.libro));
          this.validateBookOnly(this.arrayData[i].cantidad, this.indexBook);
        }
        // por libro
      }
    }

    this.arrayBooks.sort(this.compare);
    // console.log('Libros agrupados: ', this.arrayBooks);
    // console.log('Datos agrupados: ', this.arrayGroup);
    this.data = this.transformDataCompras(this.arrayGroup);
    this.labels = this.transformDataDays(this.arrayGroup);
    this.egresos = this.transformDataIngresos(this.arrayGroup);

    console.log('DATA: ', this.data);
    console.log('LABELS: ', this.labels);
    this.chartOne();
    this.chartTwo();
  }

  validateDay(cant: number, value: number) {
    this.dataDay.compras = cant;
    this.dataDay.total = value;
  }

  validateDayOnly(cant: number, value: number, index: number) {
    this.arrayGroup[index].compras = this.arrayGroup[index].compras + cant;
    this.arrayGroup[index].total = this.arrayGroup[index].total + value;
  }

  validateBook(cant: number) {
    this.dataBook.compras = cant;
  }

  validateBookOnly(cant: number, index: number) {
    this.arrayBooks[index].compras = this.arrayBooks[index].compras + cant;
  }

  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const genreA = a.compras;
    const genreB = b.compras;

    let comparison = 0;
    if (genreA < genreB) {
      comparison = 1;
    } else if (genreA > genreB) {
      comparison = -1;
    }
    return comparison;
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
          label: 'Libros comprados',
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
              stepSize: Math.max(...this.data) / this.data.length
            },
            scaleLabel: {
              display: true,
              labelString: 'Libros comprados'
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
          label: 'Egresos por compras (MXN)',
          data: this.egresos,
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
              stepSize: Math.max(...this.egresos) / this.egresos.length
            },
            scaleLabel: {
              display: true,
              labelString: 'Egresos por compras (MXN)'
            }
          }]
        }
      }
    });
  }

  groupProvider() {
    this.arrayProviders.length = 0;
    if (this.purchasesArray.length === 1) {

      this.dataProvider = {
        proveedor: this.purchasesArray[0].factura.proveedor,
        numCompras: 0
      };
      this.validateClient(1);
      this.arrayProviders.push(this.dataProvider);

    } else {
      for (let i = 0; i < this.purchasesArray.length; i++) {
        if (i === 0) {

          this.dataProvider = {
            proveedor: this.purchasesArray[i].factura.proveedor,
            numCompras: 0
          };
          this.validateClient(1);
          this.arrayProviders.push(this.dataProvider);

          i++;
        }
        this.dataSearchProvider = this.arrayProviders.filter(data => data.proveedor === this.purchasesArray[i].factura.proveedor)[0];

        if (this.dataSearchProvider === undefined) {

          this.dataProvider = {
            proveedor: this.purchasesArray[i].factura.proveedor,
            numCompras: 0
          };
          this.validateClient(1);
          this.arrayProviders.push(this.dataProvider);

        } else {
          // En esta parte entra si el objeto ya existe, por lo que solo actualizaremos la información.
          this.indexPriver = this.arrayProviders.indexOf(this.arrayProviders.find(data => data.proveedor === this.dataSearchProvider.proveedor));
          this.validateClientOnly(1, this.indexPriver);
        }
      }
    }
    this.arrayProviders.sort(this.compareClient);
    // console.log('Clientes agrupados: ', this.arrayClients);
  }

  compareClient(a, b) {
    // Use toUpperCase() to ignore character casing
    const genreA = a.numCompras;
    const genreB = b.numCompras;

    let comparison = 0;
    if (genreA < genreB) {
      comparison = 1;
    } else if (genreA > genreB) {
      comparison = -1;
    }
    return comparison;
  }

  validateClient(cant: number) {
    this.dataProvider.numCompras = cant;
  }

  validateClientOnly(cant: number, index: number) {
    this.arrayProviders[index].numCompras = this.arrayProviders[index].numCompras + cant;
  }

  excel() {
    let total = 0;
    let descuento = 0;
    const listado: any[] = [];

    for (let i = 0; i < this.purchasesArray.length; i++) {
      listado.push(['Factura ' + i]);
      listado.push(['Codigo: ' + this.purchasesArray[i].factura.codigo]);
      listado.push(['Fecha: ' + this.purchasesArray[i].factura.created_at]);
      listado.push(['Proveedor: ' + this.purchasesArray[i].factura.proveedor]);
      listado.push(['Libro', 'Cantidad', 'Total ($)', 'Descuento ($)']);

      for (let j = 0; j < this.purchasesArray[i].compras.length; j++) {
        listado.push([this.purchasesArray[i].compras[j].libro,
        this.purchasesArray[i].compras[j].cantidad,
        this.purchasesArray[i].compras[j].total,
        this.purchasesArray[i].compras[j].descuento]);
        total += this.purchasesArray[i].compras[j].total;
        descuento += this.purchasesArray[i].compras[j].descuento;
      }
      listado.push(['']);

    }
    listado.push(['']);
    listado.push(['Total: $' + total]);
    listado.push(['Descuento total: $' + descuento]);
    listado.push(['Libro mas comprado: ' + this.arrayBooks[0].libro]);
    //listado.push(['Proveedor mas frecuente: ' + this.arrayProviders[0].proveedor]);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(listado);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte de compras');

    XLSX.writeFile(wb, 'compras.xlsx');
  }

}
