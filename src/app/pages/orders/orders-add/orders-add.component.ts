import { Component, OnInit } from '@angular/core';
import { BooksService } from 'src/app/common/services/books.service';
import { Book } from 'src/app/common/models/book.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/common/models/customer.model';
import { CustomersService } from 'src/app/common/services/customers.service';
import { Order } from 'src/app/common/models/order.model';
import { OrderService } from 'src/app/common/services/order.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/common/services/alert.service';

@Component({
  selector: 'app-orders-add',
  templateUrl: './orders-add.component.html',
  styleUrls: ['./orders-add.component.scss']
})
export class OrdersAddComponent implements OnInit {

  books: Array<Book>=new Array<Book>();
  booksFiltered: Array<Book>=new Array<Book>();
  bookSelected: Book;
  customers: Array<Customer>=new Array<Customer>();
  customersFiltered: Array<Customer>=new Array<Customer>();
  customerSelected: Customer;
  formData: FormGroup;
  orders: Array<Order> = new Array<Order>();

  constructor(private bookService: BooksService,
    private customerService: CustomersService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService) {
    this.formData = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      cliente: ['', [Validators.required]],
      cantidad: ['', [Validators.required]]
    });
   }

  ngOnInit() {
    this.bookService.getBooks().subscribe((data:any)=>{
      this.books=data.data
      this.booksFiltered=data.data;
    },error=>{
      console.log(error);
      
    });

    this.customerService.getCustomers().subscribe((data:any)=>{
      this.customers=data.data
      this.customersFiltered=data.data;
    },error=>{
      console.log(error);
      
    });
  }

  filterBook(){
    let titulo=this.formData.controls['titulo'].value;
    let newBooks=new Array<Book>();

    for (let i = 0; i < this.books.length; i++) {
      let index=this.books[i].titulo.toLowerCase().indexOf(titulo.toLowerCase());
      if(index!=-1){
        newBooks.push(this.books[i]);
      }
    }

    if(newBooks.length===1){
      this.bookSelected=newBooks[0];
      //console.log(this.bookSelected);
    }else if(newBooks.length===0){
      let book:Book={
        id: 0,
        titulo: "No encontrado",
        autor:"",
        isbn: "",
        precio: 0,
        descuento: 0,
        stock: 0
      }
      newBooks.push(book);
      this.bookSelected=book;
    }
    this.booksFiltered=newBooks;
  }

  filterCustomer(){
    let cliente=this.formData.controls['cliente'].value;
    let newCustomers=new Array<Customer>();

    for (let i = 0; i < this.customers.length; i++) {
      let index=this.customers[i].nombre.toLowerCase().indexOf(cliente.toLowerCase());
      if(index!=-1){
        newCustomers.push(this.customers[i]);
      }
    }

    if(newCustomers.length===1){
      this.customerSelected=newCustomers[0];
      //console.log(this.customerSelected);
    }else if(newCustomers.length===0){
      let customer:Customer={
        id: 0,
        nombre: "No encontrado",
        telefono: ""
      }
      newCustomers.push(customer);
      this.customerSelected=customer;
    }
    this.customersFiltered=newCustomers;
  }

  selectBook(index){
    this.bookSelected=this.booksFiltered[index];
    //console.log(this.bookSelected);
    
  }

  selectCustomer(index){
    this.customerSelected=this.customersFiltered[index];
    //console.log(this.customerSelected);
    
  }


  addOrder(){

    if(this.bookSelected.id!=0 && this.customerSelected.id!=0){
      let order:Order={
        fecha : new Date().getFullYear().toString()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate().toString(),
        cantidad : this.formData.controls['cantidad'].value,
        estado : "pendiente",
        cliente : this.customerSelected.nombre,
        clientes_id : this.customerSelected.id,
        libro : this.bookSelected.titulo,
        libros_id : this.bookSelected.id
      }
      console.log(order);
      
      this.orders.push(order);
      this.formData.reset();
    }
    

  }

  register(){
    if(this.orders.length > 0){
      for (let i = 0; i < this.orders.length; i++) {
        this.orderService.addOrder(this.orders[i]).subscribe((data:any)=>{
          this.router.navigate(['/pages/orders']);
        },error=>{
          this.alertService.show({text: 'Uno de los pedidos no se ha podido registrar', title: 'Error', type: 'error', time: 4000});
          console.log(error);
        }); 
      }
    }else{
      console.log("No hay pedidos agregados");
      this.alertService.show({text: 'No hay pedidos agregados', title: 'Alerta', type: 'info', time: 4000});
    }
  }

  delete(i){
    this.orders.splice(i,1);
  }


}
