import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from 'src/app/common/services/books.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/services/alert.service';

@Component({
  selector: 'app-books-edit',
  templateUrl: './books-edit.component.html',
  styleUrls: ['./books-edit.component.scss']
})
export class BooksEditComponent implements OnInit {

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
      stock: ''
    });

    this.loadBook();

   }

   loadBook(){
    this.servicio.getBook(this.id).subscribe((data:any)=>{
      this.book=data.data;
      this.formData = this.formBuilder.group({
        titulo: [this.book.titulo, [Validators.required]],
        autor: [this.book.autor, [Validators.required]],
        isbn: [this.book.isbn, [Validators.required]],
        precio: [this.book.precio, [Validators.required]],
        descuento: [this.book.descuento, [Validators.required]],
        stock: [this.book.stock, [Validators.required]]
      });
    },error=>{
      console.log(error);
      
    });
   }

  ngOnInit() {
  }

  submit(){
    this.book={
      titulo : this.formData.controls['titulo'].value,
      autor : this.formData.controls['autor'].value,
      isbn : this.formData.controls['isbn'].value,
      precio: this.formData.controls['precio'].value,
      descuento: this.formData.controls['descuento'].value,
      stock: this.formData.controls['stock'].value
    };

    this.servicio.updateBook(this.id,this.book).subscribe((data:any)=>{
      this.router.navigate(['/pages/books']);
      this.alertService.show({text: 'Libro actualizado correctamente', title: 'Libro actualizado', type: 'success', time: 4000});
    },error=>{
      console.log(error);
      this.alertService.show({text: 'Error al modificar libro', title: 'Error', type: 'error', time: 4000});
    });


  }

}
