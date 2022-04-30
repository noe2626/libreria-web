import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from 'src/app/common/services/books.service';
import { AlertService } from 'src/app/common/services/alert.service';

@Component({
  selector: 'app-books-details',
  templateUrl: './books-details.component.html',
  styleUrls: ['./books-details.component.scss']
})
export class BooksDetailsComponent implements OnInit {

  id: number;
  book: any;
  formData: FormGroup = this.formBuilder.group({
    titulo: '',
    autor: '',
    isbn: '',
    precio: '',
    descuento: '',
    stock: ''
  });

  constructor(private activatedRoute: ActivatedRoute,
    private servicio: BooksService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService) {
    this.activatedRoute.params.subscribe(param=>{
      this.id=param.id;
    });
    this.formData = this.formBuilder.group({
      titulo: '',
      autor: '',
      isbn: '',
      precio: '',
      descuento: '',
      descuento_pesos: '',
      stock: ''
    });

    this.loadBook();

   }

   loadBook(){
    this.servicio.getBook(this.id).subscribe((data:any)=>{
      this.book=data.data;
      let descuento=this.book.precio*(this.book.descuento/100);
      console.log(descuento);
      
      this.formData = this.formBuilder.group({
        titulo: [this.book.titulo],
        autor: [this.book.autor],
        isbn: [this.book.isbn],
        precio: [this.book.precio],
        descuento: [this.book.descuento],
        descuento_pesos: [descuento],
        stock: [this.book.stock]
      });
    },error=>{
      console.log(error);
      
    });
   }

  ngOnInit() {
  }

}
