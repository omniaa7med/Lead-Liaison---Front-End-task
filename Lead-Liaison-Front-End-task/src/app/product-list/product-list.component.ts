import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { Product } from '../interfaces/product';
import { ProductListService } from '../service/product-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  /* ------------------------------------------------------- */
  /*                        Variables                        */
  /* ------------------------------------------------------- */

  products: Product[] = [];
  productAvailable: any = [];
  unsubscribe$ = new Subject<void>();

  constructor(private productService: ProductListService) { }

  ngOnInit(): void {
    if (JSON.parse(sessionStorage.getItem('ProductList') || '{}').length > 0) {
      this.products = JSON.parse(sessionStorage.getItem('ProductList') || '{}');
      this.products.sort((a, b) => a.id - b.id);
      this.filterProductsByCategory();
    } else {
      this.getProductListByRealTimeDataBase();
      this.filterProductsByCategory();
    }
  }

  OnDestroy(): void {
    sessionStorage.removeItem('ProductList');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

  }


  /* ------------------------------------------------------- */
  /*           Get productList From RealTime DataBase        */
  /* ------------------------------------------------------- */
  getProductListByRealTimeDataBase() {
    this.productService
      .getProductListByRealTime()
      .snapshotChanges()
      .pipe((
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )

      ), (takeUntil(this.unsubscribe$)))
      .subscribe((data: any) => {
        this.products = data;
        // console.log(this.products);
        this.products.sort((a, b) => a.id - b.id);
        sessionStorage.setItem('ProductList', JSON.stringify(this.products));
      });
  }

  /* ------------------------------------------------------- */
  /*        Get productList From FireStore Database          */
  /* ------------------------------------------------------- */

  // getProductListByFireStore() {
  //   this.productService.getProductListByFireStore().subscribe((res) => {
  //     this.products = res.map((e: any) => {
  //       return {
  //         ...(e.payload.doc.data() as Product),
  //       };
  //     });
  //     this.productService.sendProductList(this.products);
  //     this.products.sort((a, b) => a.id - b.id);
  //     sessionStorage.setItem('ProductList', JSON.stringify(this.products));
  //   });
  // }

  /* ------------------------------------------------------- */
  /*               Filter Product List By Category           */
  /* ------------------------------------------------------- */

  filterProductsByCategory() {
    this.productService.cateType.subscribe((e) => {
      this.products = JSON.parse(sessionStorage.getItem('ProductList') || '{}');
      if (e !== null && e !== 'all') {
        this.products = this.products.filter((prod) => prod.category === e);
      }
    });
  }

  /* ------------------------------------------------------- */
  /*               Fetch Product List By Category            */
  /* ------------------------------------------------------- */

  fetchProductList() {
    sessionStorage.removeItem('ProductList');
    this.productService.sendCategory('all');
    this.getProductListByRealTimeDataBase();
    this.filterProductsByCategory();
    this.productAvailable = [];
  }

  /* ------------------------------------------------------- */
  /*               Sync Specific Product Btn                 */
  /* ------------------------------------------------------- */
  syncProductBtn(product: any) {
    this.productService
      .getProductListByRealTime()
      .snapshotChanges()
      .pipe((
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      ), (takeUntil(this.unsubscribe$)))
      .subscribe((data) => {
        this.productAvailable = data.filter((e) => {
          return e.key === product.key;
        });
      });
  }
}
