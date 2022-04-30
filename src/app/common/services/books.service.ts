import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  SERVER = environment.API_ADMIN;

  constructor(private http: HttpClient) { }

  getBooks() {
    return this.http.get(this.SERVER + 'libros');
  }

  newBook(book){
    return this.http.post(this.SERVER + 'libros', book);
  }

  getBook(id){
    return this.http.get(this.SERVER + 'libros/'+id);
  }

  updateBook(id, book){
    return this.http.put(this.SERVER + 'libros/'+id, book);
  }

  deleteBook(id){
    return this.http.delete(this.SERVER + 'libros/'+id);
  }

}
