import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductListService {

  constructor(private http: HttpClient,
    private angularFirestore :AngularFirestore
    ) { }

  getProductList() {
    // console.log(this.http.get<Product>(this.configUrl))
    return this.http.get<Product>('https://lead-liaison-front-end-task-default-rtdb.firebaseio.com/ProductList.json');
  }

  getUserList() {
    return this.angularFirestore
      .collection('ProductList')
      .snapshotChanges();
  }
}
