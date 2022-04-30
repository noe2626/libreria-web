import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BooksService } from 'src/app/common/services/books.service';
import { AlertService } from 'src/app/common/services/alert.service';

@Component({
  selector: 'app-books-add',
  templateUrl: './books-add.component.html',
  styleUrls: ['./books-add.component.scss']
})
export class BooksAddComponent implements OnInit {

  book: any;
  formData: FormGroup;

  constructor(private service: BooksService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService) {
    this.formData = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      autor: ['', [Validators.required]],
      isbn: ['', [Validators.required]]
    });
   }

  ngOnInit() {
  }

  submit(){
    this.book={
      titulo : this.formData.controls['titulo'].value,
      autor : this.formData.controls['autor'].value,
      isbn : this.formData.controls['isbn'].value,
      precio: 0,
      descuento: 0,
      stock: 0
    };

    this.service.newBook(this.book).subscribe((data:any)=>{
      this.router.navigate(['/pages/books']);
      this.alertService.show({text: 'Libro agregado correctamente', title: 'Libro agregado', type: 'success', time: 4000});
    },error=>{
      console.log(error);
      this.alertService.show({text: 'No se ha podido agregar el libro', title: 'Error', type: 'error', time: 4000});
    });


  }

}
