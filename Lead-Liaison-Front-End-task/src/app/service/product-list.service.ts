import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  /* ------------------------------------------------------- */
  /*                        Variables                        */
  /* ------------------------------------------------------- */
  baseURL: string =
    'https://lead-liaison-front-end-task-default-rtdb.firebaseio.com/ProductList.json';

  private cateFilter = new BehaviorSubject(null);
  cateType = this.cateFilter.asObservable();

  private productListObservable = new BehaviorSubject(null);
  prodList = this.productListObservable.asObservable();

  constructor(
    private http: HttpClient,
    private angularFirestore: AngularFirestore
  ) { }

  /* ------------------------------------------------------- */
  /*           Get Product List By RealTimeDatabase          */
  /* ------------------------------------------------------- */
  getProductListByRealTime() {
    return this.http.get<Product>(this.baseURL);
  }
  /* ------------------------------------------------------- */
  /*              Get Product List By FireStore              */
  /* ------------------------------------------------------- */
  getProductListByFireStore() {
    return this.angularFirestore.collection('ProductList').snapshotChanges();
  }
  /* ------------------------------------------------------- */
  /*           Get Category Type From SideBar                */
  /* ------------------------------------------------------- */
  getCategory(type: any) {
    return this.cateFilter.next(type);
  }
  /* ------------------------------------------------------- */
  /*           Get Product List From component               */
  /* ------------------------------------------------------- */
  getProductList(prodList: any) {
    return this.productListObservable.next(prodList);
  }
}
