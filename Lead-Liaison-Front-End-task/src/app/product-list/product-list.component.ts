import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { Product } from '../interfaces/product';
import { ProductListService } from '../service/product-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  /* ------------------------------------------------------- */
  /*                        Variables                        */
  /* ------------------------------------------------------- */

  products: Product[] = [];
  productAvailable: any = [];
  unsubscribe$ = new Subject<void>();
  imageSrc: string =
    'https://www.cera.org.au/wp-content/uploads/2021/06/placeholder-images-image_large.png';
  constructor(private productService: ProductListService) {}

  ngOnInit(): void {
    this.productService.sendCategory('all');
    this.products = this.productService.getFromSessionStorage();
    this.filterProductsByCategory();
  }

  ngOnDestroy(): void {
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
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data: any) => {
        this.products = data;
        this.products.sort((a, b) => a.id - b.id);
        this.productService.setIntSessionStorage(this.products);
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
  //     this.productService.setIntSessionStorage(this.products);
  //   });
  // }

  /* ------------------------------------------------------- */
  /*               Filter Product List By Category           */
  /* ------------------------------------------------------- */

  filterProductsByCategory() {
    this.productService.cateType.subscribe((e) => {
      this.products = this.productService.getFromSessionStorage();
      if (e !== null && e !== 'all' && this.products.length > 0) {
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
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        this.productAvailable = data.filter((e) => {
          return e.key === product.key;
        });
      });
  }
}
