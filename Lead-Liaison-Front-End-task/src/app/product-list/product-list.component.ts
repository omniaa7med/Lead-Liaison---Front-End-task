import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
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

  constructor(private productService: ProductListService) {}

  ngOnInit(): void {
    if (JSON.parse(sessionStorage.getItem('ProductList') || '{}').length > 0) {
      this.products = JSON.parse(sessionStorage.getItem('ProductList') || '{}');
      // this.productService.sendProductList(this.products);
      this.filterProductsByCategory();
    } else {
      // this.getProductListByRealTimeDataBase();
      this.getProductListByFireStore();
      this.filterProductsByCategory();
    }
  }
  OnDestroy(): void {
    sessionStorage.removeItem('ProductList');
  }
  /* ------------------------------------------------------- */
  /*           Get productList From RealTime DataBase        */
  /* ------------------------------------------------------- */
  getProductListByRealTimeDataBase() {
    this.productService.getProductListByRealTime().subscribe((data: any) => {
      this.products = Object.keys(data).map((key) => data[key]);
      // console.log(this.products);
      this.productService.sendProductList(this.products);
      // this.products = this.productService.prodList.subscribe(prod => {
      //   console.log(prod);
      //   // this.products = prod
      //   return prod
      // })
      sessionStorage.setItem('ProductList', JSON.stringify(this.products));
    });
  }
  /* ------------------------------------------------------- */
  /*        Get productList From FireStore Database          */
  /* ------------------------------------------------------- */
  getProductListByFireStore() {
    this.productService.getProductListByFireStore().subscribe((res) => {
      // console.log();
      this.products = res.map((e: any) => {
        return {
          ...(e.payload.doc.data() as Product),
        };
      });
      this.productService.sendProductList(this.products);
      sessionStorage.setItem('ProductList', JSON.stringify(this.products));
    });
  }
  /* ------------------------------------------------------- */
  /*               Filter Product List By Category           */
  /* ------------------------------------------------------- */
  filterProductsByCategory() {
    this.productService.cateType.subscribe((e) => {
      if (e !== null) {
        this.products = JSON.parse(
          sessionStorage.getItem('ProductList') || '{}'
        );
        if (e !== 'all') {
          this.products = this.products.filter((prod) => prod.category === e);
        }
      }
    });
  }
  /* ------------------------------------------------------- */
  /*               Fetch Product List By Category           */
  /* ------------------------------------------------------- */
  fetchProductList() {
    sessionStorage.removeItem('ProductList');
    // this.getProductListByRealTimeDataBase();
    this.getProductListByFireStore();
    this.filterProductsByCategory();
  }
}
