import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { getDatabase, ref, push, set } from 'firebase/database';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  /* ------------------------------------------------------- */
  /*                        Variables                        */
  /* ------------------------------------------------------- */
  // db = getDatabase();

  // baseURL: string =
  //   'https://lead-liaison-front-end-task-default-rtdb.firebaseio.com/ProductList.json';

  private cateFilter = new BehaviorSubject(null);
  cateType = this.cateFilter.asObservable();

  private productListObservable = new BehaviorSubject(null);
  prodList = this.productListObservable.asObservable();

  private dbPath = '/ProductList';
  productListRef: AngularFireList<Product>;

  constructor(
    private http: HttpClient,
    private angularFirestore: AngularFirestore,
    private db: AngularFireDatabase
  ) {
    this.productListRef = db.list(this.dbPath);
  }
  /* ------------------------------------------------------- */
  /*           Get Products From session Storage              */
  /* ------------------------------------------------------- */
  getFromSessionStorage() {
    if (
      JSON.parse(sessionStorage.getItem('ProductList') || '[]').length === 0
    ) {
      this.getProductListByRealTime()
        .snapshotChanges()
        .pipe(
          map((changes) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
        .subscribe((data: any) => {
          this.setIntSessionStorage(data.sort((a: any, b: any) => a.id - b.id));
        });
      return JSON.parse(sessionStorage.getItem('ProductList') || '[]');
    } else {
      return JSON.parse(sessionStorage.getItem('ProductList') || '[]');
    }
  }
  /* ------------------------------------------------------- */
  /*            Set Products in session Storage          */
  /* ------------------------------------------------------- */
  setIntSessionStorage(products: Product[]) {
    sessionStorage.setItem('ProductList', JSON.stringify(products));
  }
  /* ------------------------------------------------------- */
  /*           Get Product List By RealTimeDatabase          */
  /* ------------------------------------------------------- */
  getProductListByRealTime(): AngularFireList<Product> {
    return this.productListRef;
  }
  /* ------------------------------------------------------- */
  /*              Get Product List By FireStore              */
  /* ------------------------------------------------------- */
  // getProductListByFireStore(): Observable<any> {
  //   return this.angularFirestore.collection('ProductList').snapshotChanges();
  // }
  /* ------------------------------------------------------- */
  /*           Get Category Type From SideBar                */
  /* ------------------------------------------------------- */
  sendCategory(type: any) {
    return this.cateFilter.next(type);
  }
  /* ------------------------------------------------------- */
  /*           Get Product List From component               */
  /* ------------------------------------------------------- */
  sendProductList(prodList: any) {
    return this.productListObservable.next(prodList);
  }
  /* ------------------------------------------------------- */
  /*           Add New Product To DataBase RealTime          */
  /* ------------------------------------------------------- */
  createProduct(Product: Product): any {
    return this.productListRef.push(Product);
  }
  /* ------------------------------------------------------- */
  /*           Add New Product To DataBase FireStore         */
  /* ------------------------------------------------------- */
  // createProduct(Product: Product) {
  //   return new Promise<any>((resolve, reject) => {
  //     this.angularFirestore
  //       .collection('ProductList')
  //       .add(Product)
  //       .then(
  //         (response) => {
  //           console.log(response);
  //         },
  //         (error) => reject(error)
  //       );
  //   });
  // }
}
