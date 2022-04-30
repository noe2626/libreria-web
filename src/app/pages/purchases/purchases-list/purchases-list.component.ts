import {Component, OnInit} from '@angular/core';
import {PurchasesService} from "../../../common/services/purchases.service";
import {FilterPurchases, Purchase} from "../../../common/models/purchase.model";
import {BooksService} from "../../../common/services/books.service";
import {Book} from "../../../common/models/book.model";
import {AlertService} from "../../../common/services/alert.service";
import {InvoicesService} from "../../../common/services/invoices.service";
import {Invoice} from "../../../common/models/invoice.model";
import {ProvidersService} from "../../../common/services/providers.service";
import {Provider} from "../../../common/models/provider.model";
import * as moment from 'moment';


@Component({
  selector: 'app-purchases-list',
  templateUrl: './purchases-list.component.html',
  styleUrls: ['./purchases-list.component.scss']
})
export class PurchasesListComponent implements OnInit {

  Purchases: Array<Purchase> = new Array<Purchase>();
  Books: Array<Book> = new Array<Book>();
  filterPurchases: Array<FilterPurchases> = new Array<FilterPurchases>();
  searchPurchases: Array<FilterPurchases> = new Array<FilterPurchases>();
  Invoices: Array<Invoice> = new Array<Invoice>();
  Providers: Array<Provider> = new Array<Provider>();
  purchaseID: number;
  filter: string;
  admin: Boolean;

  constructor(private purchasesService: PurchasesService,
              private booksService: BooksService,
              private alertService: AlertService,
              private invoicesService: InvoicesService,
              private providersService: ProvidersService) {
                if(localStorage.getItem('admin')==="true"){
                  this.admin=true;
                }else{
                  this.admin=false;
                }
    this.getInvoices();
  }

  getInvoices(){
    this.invoicesService.allInvoices().subscribe((response: any) => {
      this.Invoices = response.data;
      this.getProviders();
    }, (error) => {
      console.log(error);
    });
  }

  getProviders(){
    this.providersService.allProviders().subscribe((response: any) => {
      this.Providers = response.data;
      console.log(this.Providers, 'Mostrando todos los proveedores');
      this.getBooks();
    }, (error) => {
      console.log(error);
    });
  }

  getBooks(){
    this.booksService.getBooks().subscribe((response: any) => {
      this.Books = response.data;
      this.getPurchases();
    }, (error) => {
      console.log(error);
    });
  }

  getPurchases(){
    this.purchasesService.allPurchases().subscribe((response: any) => {
      this.Purchases = response.data;
       this.Purchases.reverse();
       this.filterAll();
    }, (error) => {
      console.log(error);
    });
  }

  filterAll() {
    this.searchPurchases.length = 0;
    this.filterPurchases.length = 0;

    for (let i = 0; i < this.Purchases.length; i++) {

      const purchases: FilterPurchases = {
        id: this.Purchases[i].id,
        libro: this.bookName(this.Purchases[i].libro_id),
        cantidad: this.Purchases[i].cantidad,
        total: this.Purchases[i].total,
        proveedor: this.providerName(this.Purchases[i].factura_id),
        fecha: this.dateName(this.Purchases[i].factura_id)
      };

      this.filterPurchases.push(purchases);
      this.searchPurchases.push(purchases);
    }
  }

  bookName(id: number): string {
    let Book: Book ;
    Book = this.Books.find(data => data.id === id);
    return Book.titulo;
  }

  dateName(id: number): string{
    let invoice: Invoice;
    invoice = this.Invoices.find(data => data.id === id);
    return invoice.fecha;
  }

  providerName(id: number): string {
    let invoice: Invoice;
    invoice = this.Invoices.find(data => data.id === id);

    let provider: Provider;
    provider = this.Providers.find(data => data.id === invoice.proveedor_id);

    return provider.nombre

  }

  selectPurchase(id: number) {
    this.purchaseID = id;
  }


  deletePurchase(){
    this.purchasesService.deletePurchase(this.purchaseID).subscribe((response: any) => {

      this.alertService.show({ text: 'Compra eliminada correctamente', title: 'Registro Exitoso', type: 'success', time: 4000 });

      const index = this.Purchases.indexOf(this.Purchases.find(data => data.id === this.purchaseID));
      this.Purchases.splice(index, 1);
      this.filterAll();
      console.log(response);
    }, (error) => {

      this.alertService.show({ text: 'No se pudo eliminar la compra', title: 'Registro Fallido', type: 'error', time: 4000 });
      console.log(error);
    });
  }



  search(){
    this.searchPurchases = new Array<FilterPurchases>();
    for (let i = 0; i < this.filterPurchases.length; i++) {
      let titleIndex = this.filterPurchases[i].libro.toLowerCase().indexOf(this.filter.toLowerCase());
      if(titleIndex!= -1){
        this.searchPurchases.push(this.filterPurchases[i]);
      }
    }
  }

  ngOnInit() {
  }

}
