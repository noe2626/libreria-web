import { Component, OnInit } from '@angular/core';
import { Pending } from 'src/app/common/models/pending.model';
import { PendingService } from 'src/app/common/services/pending.service';
import { Router } from '@angular/router';
import { BooksService } from 'src/app/common/services/books.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Book } from 'src/app/common/models/book.model';
import { AlertService } from 'src/app/common/services/alert.service';

@Component({
  selector: 'app-pendings-edit',
  templateUrl: './pendings-edit.component.html',
  styleUrls: ['./pendings-edit.component.scss']
})
export class PendingsEditComponent implements OnInit {

  pending: Pending;
  formData: FormGroup;
  book: Book;

  constructor(private pendingService: PendingService,
    private router: Router,
    private bookService: BooksService,
    private formBuilder: FormBuilder,
    private alertService: AlertService) {
    this.pending=pendingService.getPending();
    if(this.pending!==null){
      this.formData = this.formBuilder.group({
        titulo: [this.pending.libro, [Validators.required]],
        cliente: [this.pending.cliente, [Validators.required]],
        cantidad: [this.pending.cantidad, [Validators.required]]
      });

      this.bookService.getBook(this.pending.libros_id).subscribe((data: any) => {
        this.book = data.data;
      }, error => {
        console.log(error);
      });

    }else{
      this.router.navigate(['/pages/pendings']);
    }

  }

  ngOnInit() {
  }

  sale() {
    //console.log(this.pending);

    document.getElementById('btnModal').click();
  }

  saveSale(){
    this.pendingService.addTicket(
      {
        folio: new Date().getFullYear().toString() + (new Date().getMonth() + 1) + new Date().getDate().toString() +
        new Date().getHours().toString() + new Date().getMinutes().toString() + new Date().getSeconds().toString(),
        fecha: new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate().toString(),
        empleado_id: localStorage.getItem('user_id'),
        cliente_id: this.pending.clientes_id
      }
    ).subscribe((data: any) => {
      let total = this.pending.cantidad * this.book.precio;
      let descuento = total * (this.book.descuento / 100);
      this.pendingService.addSale(
        {
          descripcion: "venta de libro " + this.book.titulo,
          cantidad: this.pending.cantidad,
          total: total,
          descuento: descuento,
          libro_id: this.book.id,
          ticket_id: data.data.id
        }).subscribe((data: any) => {
          this.pendingService.deletePending(this.pending.id).subscribe((data:any)=>{
            this.alertService.show({text: 'La venta fué registrada', title: 'Venta realizada', type: 'success', time: 4000});
          this.router.navigate(['/pages/pendings']);
          },error=>{
            console.log(error);
            this.alertService.show({text: 'La venta fue registrada, elimnar el pendiente de forma manual', title: 'Venta realizada', type: 'info', time: 4000});
            this.router.navigate(['/pages/pendings']);
          });
        }, error => {
          console.log(error);
          this.alertService.show({text: 'Error al registrar venta, vuelva a intentarlo', title: 'Error', type: 'error', time: 4000});
          this.router.navigate(['/pages/pendings']);
        });
    }, error => {
      console.log(error);
      this.alertService.show({text: 'Error al registrar venta, vuelva a intentarlo', title: 'Error', type: 'error', time: 4000});
      this.router.navigate(['/pages/pendings']);
    });
  }

}
