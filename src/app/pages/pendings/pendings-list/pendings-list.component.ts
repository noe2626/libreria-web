import { Component, OnInit } from '@angular/core';
import { Pending } from 'src/app/common/models/pending.model';
import { Customer } from 'src/app/common/models/customer.model';
import { Book } from 'src/app/common/models/book.model';
import { BooksService } from 'src/app/common/services/books.service';
import { CustomersService } from 'src/app/common/services/customers.service';
import { PendingService } from 'src/app/common/services/pending.service';
import { AlertService } from 'src/app/common/services/alert.service';

@Component({
  selector: 'app-pendings-list',
  templateUrl: './pendings-list.component.html',
  styleUrls: ['./pendings-list.component.scss']
})
export class PendingsListComponent implements OnInit {


  pendings: Array<Pending>=new Array<Pending>();
  allPendings: Array<Pending>=new Array<Pending>();
  customers: Array<Customer>=new Array<Customer>();
  books: Array<Book>=new Array<Book>();
  pedingSelect: string;
  pendingId;
  admin: boolean;

  constructor(private pendingService: PendingService,
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
     this.pendingService.getPendings().subscribe((data:any)=>{
      this.pendings=data.data;
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
    for (let i = 0; i < this.pendings.length; i++) {
      let indexBook=this.books.indexOf(this.books.find(data => data.id === this.pendings[i].libros_id));
      let indexCustomer=this.customers.indexOf(this.customers.find(data => data.id === this.pendings[i].clientes_id));
      if(indexBook!=-1){
        this.pendings[i].libro=this.books[indexBook].titulo;
      }else{
        this.pendings[i].libro='No disponible'
      }

      if(indexCustomer!=-1){
        this.pendings[i].cliente=this.customers[indexCustomer].nombre;
      }else{
        this.pendings[i].cliente='No disponible'
      }
      
    }
    //console.log(this.pendings);
    this.allPendings=this.pendings;
   }

  ngOnInit() {
  }

  savePending(pending: Pending){
    this.pendingService.setPending(pending);
  }

  selectPending(id){
    this.pendingId=id;
  }

  delete(){
    this.pendingService.deletePending(this.pendingId).subscribe((data:any)=>{
      this.loadOrders();
      this.alertService.show({text: 'Se eliminó el pendiente', title: 'Operación exitosa', type: 'success', time: 4000});
    },error=>{
      console.log(error);
      
    });
  }

  search(){
    this.pendings=new Array<Pending>();
    for (let i = 0; i < this.allPendings.length; i++) {
      let titleIndex=this.allPendings[i].libro.toLowerCase().indexOf(this.pedingSelect.toLowerCase());
      if(titleIndex!= -1 ){
        this.pendings.push(this.allPendings[i]);
      }
    }
  }

}
