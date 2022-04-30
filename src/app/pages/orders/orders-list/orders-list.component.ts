import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/common/models/order.model';
import { OrderService } from 'src/app/common/services/order.service';
import { BooksService } from 'src/app/common/services/books.service';
import { CustomersService } from 'src/app/common/services/customers.service';
import { Customer } from 'src/app/common/models/customer.model';
import { Book } from 'src/app/common/models/book.model';
import { AlertService } from 'src/app/common/services/alert.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {

  allOrders: Array<Order>=new Array<Order>();
  orders: Array<Order>=new Array<Order>();
  selectedBooks: Array<Order>=new Array<Order>();
  customers: Array<Customer>=new Array<Customer>();
  books: Array<Book>=new Array<Book>();
  option = 'pendiente';
  deleteId;
  deleteIndex;
  filterBook: string;
  admin: boolean;

  constructor(private orderService: OrderService,
    private bookService: BooksService,
    private customerService: CustomersService,
    private alertService: AlertService) {
      this.loadOrders();
      if(localStorage.getItem('admin')==="true"){
        this.admin=true;
      }else{
        this.admin=false;
      }
   }

   loadOrders(){
     this.orderService.getOrders().subscribe((data:any)=>{
      this.orders=data.data;
      this.bookService.getBooks().subscribe((data:any)=>{
        this.books=data.data;
        this.customerService.getCustomers().subscribe((data:any)=>{
          this.customers=data.data;
          this.filter();
        },error=>{
          console.log(error);
        });
      },error=>{
        console.log(error);
      });
     },error=>{
       console.log(error);
     });

   }

  filter(){
    for (let i = 0; i < this.orders.length; i++) {
      let indexBook=this.books.indexOf(this.books.find(data => data.id === this.orders[i].libros_id));
      let indexCustomer=this.customers.indexOf(this.customers.find(data => data.id === this.orders[i].clientes_id));
      if(indexBook!=-1){
        this.orders[i].libro=this.books[indexBook].titulo;
      }else{
        this.orders[i].libro='No disponible'
      }

      if(indexCustomer!=-1){
        this.orders[i].cliente=this.customers[indexCustomer].nombre;
      }else{
        this.orders[i].cliente='No disponible'
      }
      
    }
    //console.log(this.orders);
    this.allOrders=this.orders;
    this.filterOption();
  }

  ngOnInit() {
  }

  saveOrder(order: Order){
    this.orderService.setOrder(order);
  }

  selectOrder(id, index){
    this.deleteId=id;
    this.deleteIndex=index;
  }

  delete(){
    this.orderService.deleteOrder(this.deleteId).subscribe((data:any)=>{
      this.loadOrders();
      this.alertService.show({text: 'La orden ha sido eliminada con éxito', title: 'Orden eliminada', type: 'success', time: 4000});
    },error=>{
      console.log(error);
      this.alertService.show({text: 'No se ha podido eliminar la orden', title: 'Error', type: 'error', time: 4000});
    });
  }

  filterOption(){
    if(this.option==='todos'){
      this.orders=this.allOrders;
      this.selectedBooks=this.orders;
    }else{
      this.orders=new Array<Order>();
      for (let i = 0; i < this.allOrders.length; i++) {
        if(this.allOrders[i].estado===this.option){
          this.orders.push(this.allOrders[i]);
        }
      }
      this.selectedBooks=this.orders;
    }
  }

  search(){
    let filteredBooks=new Array<Order>(); 
    this.orders=this.selectedBooks;
    for (let i = 0; i < this.selectedBooks.length; i++) {
      let titleIndex=this.selectedBooks[i].libro.toLowerCase().indexOf(this.filterBook.toLowerCase());
      if(titleIndex != -1){
        filteredBooks.push(this.orders[i]);
      }
    }
    this.orders=filteredBooks;
  }

}
