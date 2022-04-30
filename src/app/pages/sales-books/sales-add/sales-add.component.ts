import { Component, OnInit } from '@angular/core';
import { SelesService } from 'src/app/common/services/seles.service';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomersService } from 'src/app/common/services/customers.service';
import { BooksService } from 'src/app/common/services/books.service';
import { Book } from 'src/app/common/models/book.model';
import { Customer } from 'src/app/common/models/customer.model';
import { AlertService } from 'src/app/common/services/alert.service';

@Component({
  selector: 'app-sales-add',
  templateUrl: './sales-add.component.html',
  styleUrls: ['./sales-add.component.scss']
})
export class SalesAddComponent implements OnInit {

  formData: FormGroup;
  books: Array<Book> = new Array<Book>();
  booksFiltered: Array<Book> = new Array<Book>();
  bookSelected: Book;
  customers: Array<Customer> = new Array<Customer>();
  customersFiltered: Array<Customer> = new Array<Customer>();
  customerSelected: Customer;
  sales: Array<any> = new Array<any>();

  indexSale: number;

  userId: number;
  importe = 0;

  constructor(private _sales: SelesService, private router: Router, private formBuilder: FormBuilder,
    private customerService: CustomersService, private bookService: BooksService, private alertService: AlertService) {
    this.formData = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      cliente: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      cantidad: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.userId = parseInt(localStorage.getItem('user_id'), 10);
    this.bookService.getBooks().subscribe((data: any) => {
      this.books = data.data;
      this.booksFiltered = data.data;
    }, error => {
      console.log(error);
    });

    this.customerService.getCustomers().subscribe((data: any) => {
      this.customers = data.data;
      this.customersFiltered = data.data;
    }, error => {
      console.log(error);
    });
  }

  filterBook() {
    const titulo = this.formData.controls['titulo'].value;
    const newBooks = new Array<Book>();

    for (let i = 0; i < this.books.length; i++) {
      const index = this.books[i].titulo.toLowerCase().indexOf(titulo.toLowerCase());
      if (index !== -1) {
        newBooks.push(this.books[i]);
      }
    }

    if (newBooks.length === 1) {
      this.bookSelected = newBooks[0];
      // console.log(this.bookSelected);
    } else if (newBooks.length === 0) {
      const book: Book = {
        id: 0,
        titulo: 'No encontrado',
        autor: '',
        isbn: '',
        precio: 0,
        descuento: 0,
        stock: 0
      }
      newBooks.push(book);
      this.bookSelected = book;
    }
    this.booksFiltered = newBooks;
  }

  filterCustomer() {
    const cliente = this.formData.controls['cliente'].value;
    const newCustomers = new Array<Customer>();

    for (let i = 0; i < this.customers.length; i++) {
      const index = this.customers[i].nombre.toLowerCase().indexOf(cliente.toLowerCase());
      if (index !== -1) {
        newCustomers.push(this.customers[i]);
      }
    }

    if (newCustomers.length === 1) {
      this.customerSelected = newCustomers[0];
      // console.log(this.customerSelected);
    } else if (newCustomers.length === 0) {
      const customer: Customer = {
        id: 0,
        nombre: 'No encontrado',
        telefono: ''
      };
      newCustomers.push(customer);
      this.customerSelected = customer;
    }
    this.customersFiltered = newCustomers;
  }

  selectBook(index) {
    this.bookSelected = this.booksFiltered[index];
    // console.log(this.bookSelected);
  }

  selectCustomer(index) {
    this.customerSelected = this.customersFiltered[index];
    // console.log(this.customerSelected);
  }

  addSale() {
    if (this.bookSelected.id !== 0 && this.customerSelected.id !== 0) {
      if (this.bookSelected.stock > 0 && this.bookSelected.stock >= this.formData.controls['cantidad'].value) {
        console.log('stock: ', this.bookSelected.stock);
        const total = this.formData.controls['cantidad'].value * this.bookSelected.precio;
        const descuento = total * (this.bookSelected.descuento / 100);
        const sale: any = {
          descripcion: this.formData.controls['descripcion'].value,
          cantidad: this.formData.controls['cantidad'].value,
          total: total,
          descuento: descuento,
          libro_id: this.bookSelected.id,
          ticket_id: 0,
          libro: this.bookSelected.titulo
        };
        console.log(sale);

        this.sales.push(sale);
        // limpiar inputs
        this.formData.controls['titulo'].setValue('');
        this.formData.controls['cantidad'].setValue('');
        this.formData.controls['descripcion'].setValue('');
        this.importe = 0;
        this.sales.forEach(element => {
          this.importe += element.total;
        });
      } else {
        this.alertService.show({ text: 'Stock insuficiente', title: 'Stock', type: 'error', time: 4000 });
      }
    }
  }

  selectSale(id: number) {
    this.indexSale = id;
  }

  deleteSale() {
    this.sales.splice(this.indexSale, 1);
    console.log(this.sales);
    this.importe = 0;
    this.sales.forEach(element => {
      this.importe += element.total;
    });
  }

  saveSale() {
    this._sales.addTicket(
      {
        folio: new Date().getFullYear().toString() + (new Date().getMonth() + 1) + new Date().getDate().toString() +
               new Date().getHours().toString() + new Date().getMinutes().toString() + new Date().getSeconds().toString(),
        fecha: new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate().toString(),
        empleado_id: this.userId,
        cliente_id: this.customerSelected.id,
      }
    ).subscribe((data: any) => {
      let num = this.sales.length;
      this.sales.forEach(element => {
        num--;
        element.ticket_id = data.data.id;

        this._sales.addSale(element).subscribe((resp: any) => {
          console.log('!!: ', num);
          this.getBook(element.libro_id, element.cantidad);
          if (num <= 0) {
            this.importe = 0;
            this.sales.length = 0;
            this.formData.reset();
            this.router.navigate(['/pages/sales']);
            this.alertService.show({ text: 'Venta registrada correctamente', title: 'Registro Exitoso', type: 'success', time: 4000 });
          }
        }, error => {
          console.log(error);
        });

      });

    }, error => {
      this.alertService.show({ text: 'No se pudo registrar la venta', title: 'Registro Fallido', type: 'error', time: 4000 });
      console.log(error);
    });
  }

  getBook(id, cant) {
    const indexCatalogo = this.books.indexOf(this.books.find(data => data.id === id));
    this.books[indexCatalogo].stock = this.books[indexCatalogo].stock - cant;
    const uBook = this.books[indexCatalogo];
    this.bookService.updateBook(id, uBook).subscribe(
      data => {
        console.log('stock actualizado: ', data);
      },
      err => {
        console.log(err);
      }
    );
  }

  updateStock() {

  }

}
