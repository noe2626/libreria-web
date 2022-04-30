import { Component, OnInit } from '@angular/core';
import { BooksService } from 'src/app/common/services/books.service';
import { AlertService } from 'src/app/common/services/alert.service';
import { Book } from 'src/app/common/models/book.model';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  books=new Array<Book>();
  booksAll=new Array<Book>();
  filter: string;
  deleteId;
  deleteIndex;
  deleteName;
  admin: boolean;

  constructor(private servicio: BooksService,
    private alertService: AlertService) { 
    this.load();
    if(localStorage.getItem('admin')==="true"){
      this.admin=true;
    }else{
      this.admin=false;
    }
  }

  load(){
    this.servicio.getBooks().subscribe((data:any)=>{
      this.books=data.data;
      this.booksAll=data.data;
    },error=>{
      console.log(error);
    });
  }

  ngOnInit() {
  }

  selectBook(id, index, name){
    this.deleteId=id;
    this.deleteIndex=index;
    this.deleteName=name;
  }

  delete(){
    this.servicio.deleteBook(this.deleteId).subscribe((data:any)=>{
      this.load();
      this.alertService.show({text: 'Se ha eliminado correctamente', title: 'Libro eliminado', type: 'success', time: 4000});
    },error=>{
      console.log(error);
      this.alertService.show({text: 'Error al eliminar', title: 'Error', type: 'error', time: 4000});
    });
  }

  search(){
    this.books=new Array<Book>();
    for (let i = 0; i < this.booksAll.length; i++) {
      let titleIndex=this.booksAll[i].titulo.toLowerCase().indexOf(this.filter.toLowerCase());
      let isbnIndex=this.booksAll[i].isbn.toLowerCase().indexOf(this.filter.toLowerCase());
      if(titleIndex!= -1 || isbnIndex != -1){
        this.books.push(this.booksAll[i]);
      }
    }
  }

}
