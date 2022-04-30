import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/common/services/order.service';
import { Order } from 'src/app/common/models/order.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BooksService } from 'src/app/common/services/books.service';
import { Book } from 'src/app/common/models/book.model';
import { AlertService } from 'src/app/common/services/alert.service';

@Component({
  selector: 'app-orders-edit',
  templateUrl: './orders-edit.component.html',
  styleUrls: ['./orders-edit.component.scss']
})
export class OrdersEditComponent implements OnInit {

  order: Order;
  formData: FormGroup;
  book: Book;

  constructor(private orderService: OrderService,
    private formBuilder: FormBuilder,
    private router: Router,
    private bookService: BooksService,
    private alertService: AlertService) {
    this.order = this.orderService.getOrder();
    //console.log(this.order.id);

    if (this.order) {
      this.formData = this.formBuilder.group({
        titulo: [this.order.libro, [Validators.required]],
        cliente: [this.order.cliente, [Validators.required]],
        cantidad: [this.order.cantidad, [Validators.required]],
        estado: [this.order.estado, [Validators.required]]
      });

      this.bookService.getBook(this.order.libros_id).subscribe((data: any) => {
        this.book = data.data;
      }, error => {
        console.log(error);

      });
    } else {
      this.router.navigate(['/pages/orders']);
    }



  }

  ngOnInit() {
  }

  estado() {
    this.order.estado = this.formData.controls['estado'].value;
  }

  sale() {
    console.log(this.order);

    document.getElementById('btnModal').click();
  }

  submit(){
    this.order.estado=this.formData.controls['estado'].value;
    this.orderService.editOrder(this.order.id, this.order).subscribe((data:any)=>{
      this.alertService.show({text: 'Se ha modificado con éxito', title: 'Pedido modificado', type: 'success', time: 4000});
      this.router.navigate(['/pages/orders']);
    },error=>{
      console.log(error);
      this.alertService.show({text: 'No de ha podido modificar, vuelva a intentarlo', title: 'Error', type: 'error', time: 4000});
    });
  }

  saveSale() {
    this.orderService.addTicket(
      {
        folio: new Date().getFullYear().toString() + (new Date().getMonth() + 1) + new Date().getDate().toString() +
        new Date().getHours().toString() + new Date().getMinutes().toString() + new Date().getSeconds().toString(),
        fecha: new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate().toString(),
        empleado_id: localStorage.getItem('user_id'),
        cliente_id: this.order.clientes_id
      }
    ).subscribe((data: any) => {
      let total = this.order.cantidad * this.book.precio;
      let descuento = total * (this.book.descuento / 100);
      this.orderService.addSale(
        {
          descripcion: "venta por pedido de libro " + this.book.titulo,
          cantidad: this.order.cantidad,
          total: total,
          descuento: descuento,
          libro_id: this.book.id,
          ticket_id: data.data.id
        }).subscribe((data: any) => {
          this.alertService.show({text: 'Se ha registrado con éxito', title: 'Venta registrada', type: 'success', time: 4000});
          this.order.estado = 'entregado';
          this.orderService.editOrder(this.order.id, this.order).subscribe((data: any) => {
            this.router.navigate(['/pages/orders']);
          }, error => {
            console.log(error);
            this.alertService.show({text: 'La venta fue registrada con exxito, favor de cambiar manualmente el estado del pedido', title: 'Atención', type: 'info', time: 4000});
          });
        }, error => {
          console.log(error);
          this.alertService.show({text: 'No se ha podido registrar la venta, vuelva a intentarlo', title: 'Error al registrar', type: 'error', time: 4000});
        });
    }, error => {
      console.log(error);
      this.alertService.show({text: 'No se ha podido registrar la venta, vuelva a intentarlo', title: 'Error al registrar', type: 'error', time: 4000});
    });
  }

}
