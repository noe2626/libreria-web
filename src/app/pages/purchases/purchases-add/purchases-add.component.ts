import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Book} from "../../../common/models/book.model";
import {BooksService} from "../../../common/services/books.service";
import {ProvidersService} from "../../../common/services/providers.service";
import {Provider} from "../../../common/models/provider.model";
import {Purchase} from "../../../common/models/purchase.model";
import {Invoice} from "../../../common/models/invoice.model";
import {InvoicesService} from "../../../common/services/invoices.service";
import {PurchasesService} from "../../../common/services/purchases.service";
import {AlertService} from "../../../common/services/alert.service";
import {Router} from "@angular/router";
import * as moment from 'moment';

@Component({
  selector: 'app-purchases-add',
  templateUrl: './purchases-add.component.html',
  styleUrls: ['./purchases-add.component.scss']
})
export class PurchasesAddComponent implements OnInit {

  formGroup: FormGroup;

  Books: Array<Book>= new Array<Book>();
  booksFiltered: Array<Book> = new Array<Book>();
  bookSelected: Book;


  Providers: Array<Provider>= new Array<Provider>();
  providersFiltered: Array<Provider> = new Array<Provider>();
  providerSelected: Provider;

  Purchases: Array<Purchase> = new Array<Purchase>();

  indexPurchase: number;

  constructor(private formBuilder: FormBuilder,
              private booksService: BooksService,
              private providersService: ProvidersService,
              private invoicesService: InvoicesService,
              private purchasesService: PurchasesService,
              private alertService: AlertService,
              private router: Router) {

    this.formGroup = this.formBuilder.group({
      codigo : ['', [Validators.required]],
      proveedor : ['', [Validators.required]],
      libro : ['', [Validators.required]],
      cantidad : ['', [Validators.required]],
      total : ['', [Validators.required]],
      descuento : ['', [Validators.required]]
    });
  }

  ngOnInit() {

    this.booksService.getBooks().subscribe((response: any) => {
      this.Books = response.data;
      this.booksFiltered = response.data;
    }, error => {
      console.log(error);
    });

    this.providersService.allProviders().subscribe((response: any) => {
      this.Providers = response.data;
      this.providersFiltered = response.data;
    }, error => {
      console.log(error);
    });
  }


  filterBook() {
    const titulo = this.formGroup.controls['libro'].value;
    const newBooks = new Array<Book>();

    for (let i = 0; i < this.Books.length; i++) {
      const index = this.Books[i].titulo.toLowerCase().indexOf(titulo.toLowerCase());
      if (index !== -1) {
        newBooks.push(this.Books[i]);
      }
    }

    if (newBooks.length === 1) {
      this.bookSelected = newBooks[0];
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


  filterProvider() {
    const provider = this.formGroup.controls['proveedor'].value;
    const newProviders = new Array<Provider>();

    for (let i = 0; i < this.Providers.length; i++) {
      const index = this.Providers[i].nombre.toLowerCase().indexOf(provider.toLowerCase());
      if (index !== -1) {
        newProviders.push(this.Providers[i]);
      }
    }

    if (newProviders.length === 1) {
      this.providerSelected = newProviders[0];
    } else if (newProviders.length === 0) {
      const proveedor: Provider = {
        id: 0,
        nombre: 'No encontrado',
        telefono: '',
        cuenta_bancaria: '',
        contacto: ''
      }
      newProviders.push(proveedor);
      this.providerSelected = proveedor;
    }
    this.providersFiltered = newProviders;
  }


  selectBook(index) {
    this.bookSelected = this.booksFiltered[index];
  }


  selectProvider(index) {
    this.providerSelected = this.providersFiltered[index];
  }


  addPurchase() {
    if (this.bookSelected.id !== 0 && this.providerSelected.id !== 0) {

      const purchase: Purchase = {
        cantidad: this.formGroup.controls['cantidad'].value,
        libro_id: this.bookSelected.id,
        factura_id: 1,
        total: this.formGroup.controls['total'].value,
        descuento: this.formGroup.controls['descuento'].value
      };
      this.Purchases.push(purchase);
      this.formGroup.controls['total'].setValue('');
      this.formGroup.controls['cantidad'].setValue('');
      this.formGroup.controls['descuento'].setValue('');
      this.formGroup.controls['libro'].setValue('');
    }
  }

  bookName(id: number): string {
    let Book: Book ;
    Book = this.Books.find(data => data.id === id);
    return Book.titulo;
  }

  selectPurchase(id: number) {
    this.indexPurchase = id;
  }

  deletePurchase(){
    this.Purchases.splice(this.indexPurchase, 1);
  }

  savePurchase() {
    const date = moment().format("YYYY-MM-DD HH:MM:SS");
    const invoice: Invoice = {
      fecha: date,
      codigo: this.formGroup.controls['codigo'].value,
      proveedor_id: this.providerSelected.id
    };

    this.invoicesService.createInvoice(invoice).subscribe((response: any) => {

      const invoiceID = response.data.id;
      var flagPurchase: boolean = true;

      for (let i = 0; i < this.Purchases.length; i++) {

        const purachse: Purchase = {
          cantidad: this.Purchases[i].cantidad,
          libro_id: this.Purchases[i].libro_id,
          factura_id: invoiceID,
          total: this.Purchases[i].total,
          descuento: this.Purchases[i].descuento
        };

        this.purchasesService.createPurchases(purachse).subscribe((response: any) => {

          this.booksService.getBook(purachse.libro_id).subscribe((response: any) => {
          console.log(response, 'Libro');

            const book: Book={
              titulo : response.data.titulo,
              autor : response.data.autor,
              isbn : response.data.isbn,
              precio: (purachse.total / purachse.cantidad),
              descuento: purachse.descuento,
              stock: response.data.stock + purachse.cantidad
            };

            this.booksService.updateBook(purachse.libro_id, book).subscribe((response: any) => {
              console.log(response, 'Libro actualizado');

              }, (error) => {
              console.log(error);
            });

            }, (error) => {
            console.log(error);
          });

          }, (error) => {
          flagPurchase = false;
          console.log(error);
        });

      }

      if(flagPurchase){
        this.formGroup.reset();
        this.router.navigate(['/pages/purchases']);
        this.alertService.show({ text: 'Compra registrada correctamente', title: 'Registro Exitoso', type: 'success', time: 4000 });
      } else{
        this.alertService.show({ text: 'No se pudo registrar la compra', title: 'Registro Fallido', type: 'error', time: 4000 });
      }
      }, (error) => {
      console.log(error);
    });

  }

}
