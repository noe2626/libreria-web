import { Component, OnInit } from '@angular/core';
import { SelesService } from 'src/app/common/services/seles.service';
import { AlertService } from 'src/app/common/services/alert.service';
import { BooksService } from 'src/app/common/services/books.service';
import { Book } from 'src/app/common/models/book.model';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent implements OnInit {

  salesArray: Array<any> = new Array<any>();
  allSalesArray: Array<any> = new Array<any>();
  idSale: number;
  books: Array<Book> = new Array<Book>();
  filterBook: string;
  admin: boolean;

  constructor(private _sales: SelesService, 
    private alertService: AlertService, 
    private bookService: BooksService) {
      if(localStorage.getItem('admin')==="true"){
        this.admin=true;
      }else{
        this.admin=false;
      }
  }

  ngOnInit() {
    this.getSales();
  }

  getSales() {
    this._sales.getSales().subscribe(
      (responce: any) => {

        this.salesArray = responce.data;
        // console.log('Data: ', this.salesArray);
        this.bookService.getBooks().subscribe((data: any) => {
          this.books = data.data;
          this.filter();
        }, error => {
          console.log(error);
        });
      },
      err => {
        console.log('Error: ', err);
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
    console.log(this.salesArray);
    this.allSalesArray = this.salesArray;
  }

  selectSale(id: number) {
    this.idSale = id;
  }

  deleteSale() {
    this._sales.deleteSale(this.idSale).subscribe(
      (responce: any) => {
        this.getSales();
        this.alertService.show({text: 'Venta borrada correctamente', title: 'Registro Exitoso', type: 'success', time: 4000});
        console.log(responce);
      },
      err => {
        this.alertService.show({text: 'No se pudo borrar la venta', title: 'Registro Fallido', type: 'error', time: 4000});
        console.log(err);
      }
    );
  }

  search() {
    this.salesArray = new Array<any>();
    for (let i = 0; i < this.allSalesArray.length; i++) {
      const titleIndex = this.allSalesArray[i].libro.toLowerCase().indexOf(this.filterBook.toLowerCase());
      if (titleIndex !== -1) {
        this.salesArray.push(this.allSalesArray[i]);
      }
    }
  }

}
