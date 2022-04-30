import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SelesService } from 'src/app/common/services/seles.service';
import { Book } from 'src/app/common/models/book.model';
import { BooksService } from 'src/app/common/services/books.service';
import { CustomersService } from 'src/app/common/services/customers.service';
import { Customer } from 'src/app/common/models/customer.model';
import { Employees } from 'src/app/common/models/employees.model';
import { EmployeesService } from 'src/app/common/services/employees.service';
import { ReportSales } from 'src/app/common/models/reportSales.model';
import Chart from 'chart.js';
import { ReportBooks } from 'src/app/common/models/reportBooks.model';
import { AlertService } from 'src/app/common/services/alert.service';
import { ReportClients } from 'src/app/common/models/reportClients.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('barCanvas2') barCanvas2;
  context: CanvasRenderingContext2D;
  lineChart = null;
  lineChart2 = null;

  formData: FormGroup;
  salesArray: Array<any> = new Array<any>();
  allSalesArray: Array<any> = new Array<any>();
  books: Array<Book> = new Array<Book>();
  customers: Array<Customer> = new Array<Customer>();
  Employees: Array<Employees> = new Array<Employees>();

  arrayGroup: Array<ReportSales> = new Array<ReportSales>();
  dataDay: ReportSales;

  arrayBooks: Array<ReportBooks> = new Array<ReportBooks>();
  dataBook: ReportBooks;

  arrayClients: Array<ReportClients> = new Array<ReportClients>();
  dataClient: ReportClients;

  dataSearch: any;
  dataSearchBook: any;
  dataSearchClient: any;

  index: number;
  indexBook: number;
  indexClient: number;
  arrayData: Array<any> = new Array<any>();

  data: Array<any> = new Array<any>();
  labels: Array<any> = new Array<any>();
  ingresos: Array<any> = new Array<any>();

  constructor(private formBuilder: FormBuilder, private _sales: SelesService, private bookService: BooksService,
    private customerService: CustomersService, private employeesService: EmployeesService, private alertService: AlertService) {
    this.formData = this.formBuilder.group({
      fecha_inicial: ['', [Validators.required]],
      fecha_final: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  getReport() {
    this.arrayBooks.length = 0;
    this.arrayClients.length = 0;
    // console.log(this.formData.value);
    this._sales.getReport(this.formData.controls['fecha_inicial'].value + ' 00:00:00',
      this.formData.controls['fecha_final'].value + ' 23:59:59').subscribe(
        (resp: any) => {
          // console.log(resp);
          this.salesArray = resp.data;
          if (this.salesArray.length > 0) {
            this.bookService.getBooks().subscribe((data: any) => {
              this.books = data.data;
              this.customerService.getCustomers().subscribe((restCust: any) => {
                this.customers = restCust.data;
                this.employeesService.allProviders().subscribe((response: any) => {
                  this.Employees = response.data;
                  // this.formData.reset();
                  this.filter();
                  this.groupClient();
                  // console.log(response.data);
                }, (error) => {
                  console.log(error);
                });
              }, error => {
                console.log(error);
              });
            }, error => {
              console.log(error);
            });
          } else {
            this.alertService.show({text: 'No existen datos entre las fechas', title: 'Consulta fallida', type: 'error', time: 4000});
          }
        }, err => {
          console.log(err);
        }
      );
  }

  filter() {
    for (let i = 0; i < this.salesArray.length; i++) {
      const indexCustomer = this.customers.indexOf(this.customers.find(data => data.id === this.salesArray[i].ticket.cliente_id));
      if (indexCustomer !== -1) {
        this.salesArray[i].ticket.cliente = this.customers[indexCustomer].nombre;
      } else {
        this.salesArray[i].ticket.cliente = 'No disponible';
      }

      const indexEmployees = this.Employees.indexOf(this.Employees.find(data => data.id === this.salesArray[i].ticket.empleado_id));
      if (indexEmployees !== -1) {
        this.salesArray[i].ticket.empleado = this.Employees[indexEmployees].nombre;
      } else {
        this.salesArray[i].ticket.empleado = 'No disponible';
      }

      for (let index = 0; index < this.salesArray[i].ventass.length; index++) {
        const indexBook = this.books.indexOf(this.books.find(data => data.id === this.salesArray[i].ventass[index].libro_id));
        if (indexBook !== -1) {
          this.salesArray[i].ventass[index].libro = this.books[indexBook].titulo;
        } else {
          this.salesArray[i].ventass[index].libro = 'No disponible';
        }

      }
    }
    console.log(this.salesArray);
    this.allSalesArray = this.salesArray;
    this.arrayData = this.transformGraphicData(this.salesArray);
    console.log('***: ', this.arrayData);
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

  transformDataVentas(data) {
    return data.reduce((prev, next) => {
      return prev.concat(next.ventas);
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
        ventas: 0,
        total: 0
      };
      this.validateDay(this.arrayData[0].cantidad, this.arrayData[0].total);
      this.arrayGroup.push(this.dataDay);
      // por fecha

      // por libro
      this.dataBook = {
        libro: this.arrayData[0].libro,
        ventas: 0
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
            ventas: 0,
            total: 0
          };
          this.validateDay(this.arrayData[i].cantidad, this.arrayData[i].total);
          this.arrayGroup.push(this.dataDay);
          // por fecha

          // por libro
          this.dataBook = {
            libro: this.arrayData[i].libro,
            ventas: 0
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
            ventas: 0,
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
            ventas: 0
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
    this.data = this.transformDataVentas(this.arrayGroup);
    this.labels = this.transformDataDays(this.arrayGroup);
    this.ingresos = this.transformDataIngresos(this.arrayGroup);

    // console.log('DATA: ', this.data);
    // console.log('LABELS: ', this.labels);
    this.chartOne();
    this.chartTwo();
  }

  validateDay(cant: number, value: number) {
    this.dataDay.ventas = cant;
    this.dataDay.total = value;
  }

  validateDayOnly(cant: number, value: number, index: number) {
    this.arrayGroup[index].ventas = this.arrayGroup[index].ventas + cant;
    this.arrayGroup[index].total = this.arrayGroup[index].total + value;
  }

  validateBook(cant: number) {
    this.dataBook.ventas = cant;
  }

  validateBookOnly(cant: number, index: number) {
    this.arrayBooks[index].ventas = this.arrayBooks[index].ventas + cant;
  }

  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const genreA = a.ventas;
    const genreB = b.ventas;

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
              stepSize: Math.max(...this.data) / this.data.length
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
              stepSize: Math.max(...this.ingresos) / this.ingresos.length
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

  groupClient() {
    this.arrayClients.length = 0;
    if (this.salesArray.length === 1) {

      this.dataClient = {
        cliente: this.salesArray[0].ticket.cliente,
        numCompras: 0
      };
      this.validateClient(1);
      this.arrayClients.push(this.dataClient);

    } else {
      for (let i = 0; i < this.salesArray.length; i++) {
        if (i === 0) {

          this.dataClient = {
            cliente: this.salesArray[i].ticket.cliente,
            numCompras: 0
          };
          this.validateClient(1);
          this.arrayClients.push(this.dataClient);

          i++;
        }
        this.dataSearchClient = this.arrayClients.filter(data => data.cliente === this.salesArray[i].ticket.cliente)[0];

        if (this.dataSearchClient === undefined) {

          this.dataClient = {
            cliente: this.salesArray[i].ticket.cliente,
            numCompras: 0
          };
          this.validateClient(1);
          this.arrayClients.push(this.dataClient);

        } else {
          // En esta parte entra si el objeto ya existe, por lo que solo actualizaremos la información.
          this.indexClient = this.arrayClients.indexOf(this.arrayClients.find(data => data.cliente === this.dataSearchClient.cliente));
          this.validateClientOnly(1, this.indexClient);
        }
      }
    }
    this.arrayClients.sort(this.compareClient);
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
    this.dataClient.numCompras = cant;
  }

  validateClientOnly(cant: number, index: number) {
    this.arrayClients[index].numCompras = this.arrayClients[index].numCompras + cant;
  }

  excel() {
    let total=0;
    let descuento=0;
    const listado: any[] = [];
 
    for (let i = 0; i < this.salesArray.length ; i++) {
      listado.push(['Ticket '+i]);
      listado.push(['Folio: '+this.salesArray[i].ticket.folio]);
      listado.push(['Fecha: '+this.salesArray[i].ticket.created_at]);
      listado.push(['Empleado: '+this.salesArray[i].ticket.empleado]);
      listado.push(['Cliente: '+this.salesArray[i].ticket.cliente]);
      listado.push(['Libro', 'Descripción', 'Cantidad', 'Total ($)', 'Descuento ($)']);
      
      for (let j = 0; j < this.salesArray[i].ventass.length; j++) {
        listado.push([this.salesArray[i].ventass[j].libro, 
          this.salesArray[i].ventass[j].descripcion, 
          this.salesArray[i].ventass[j].cantidad, 
          this.salesArray[i].ventass[j].total,
          this.salesArray[i].ventass[j].descuento]);
          total+=this.salesArray[i].ventass[j].total;
          descuento+=this.salesArray[i].ventass[j].descuento;
      }
      listado.push(['']);
       
    }
    listado.push(['']);
    listado.push(['Total: $'+total]);
    listado.push(['Descuento total: $'+descuento]);
    listado.push(['Libro mas vendido: '+this.arrayBooks[0].libro]);
    listado.push(['Cliente mas frecuente: '+this.arrayClients[0].cliente]);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(listado);
 
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
 
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte de ventas');
 
    XLSX.writeFile(wb, 'ventas.xlsx');
   }


}
