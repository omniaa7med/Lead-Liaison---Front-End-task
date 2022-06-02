import { Component, OnInit } from '@angular/core';
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

  constructor(private productService: ProductListService) { }
  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('ProductList') || '{}').length > 0) {
      this.products = JSON.parse(localStorage.getItem('ProductList') || '{}')
      this.productService.getProductList(this.products);
      this.filterProductsByCategory();
      // this.getProductListByFireStore();
    } else {
      this.getProductListByRealTimeDataBase();
      this.filterProductsByCategory();
      // this.getProductListByFireStore();
    }

  }
  ngOnDestroy() {
    localStorage.clear()
  }
  /* ------------------------------------------------------- */
  /*           Get productList From RealTime DataBase        */
  /* ------------------------------------------------------- */
  getProductListByRealTimeDataBase() {
    this.productService.getProductListByRealTime().subscribe((data: any) => {
      this.products = Object.keys(data).map((key) => data[key]);
      console.log(this.products);
      this.productService.getProductList(this.products);
      // this.products = this.productService.prodList.subscribe(prod => {
      //   console.log(prod);
      //   // this.products = prod
      //   return prod
      // })
      localStorage.setItem('ProductList', JSON.stringify(this.products))
    });
  }
  /* ------------------------------------------------------- */
  /*        Get productList From FireStore Database          */
  /* ------------------------------------------------------- */
  getProductListByFireStore() {
    // this.productService.getUserList().subscribe((res) => {
    //   console.log(res.map((e) => {
    //     return {
    //       // iD: e.payload.doc.id,
    //       ...(e.payload.doc.data() as Product),
    //     };
    //   }));
    // });
  }
  /* ------------------------------------------------------- */
  /*               Filter Product List By Category           */
  /* ------------------------------------------------------- */
  filterProductsByCategory() {
    this.productService.cateType.subscribe((e) => {
      if (e !== null) {
        this.products = JSON.parse(localStorage.getItem('ProductList') || '{}')
        if (e != 'all') {
          this.products = this.products.filter((prod) => prod.category === e);
          console.log(this.products);
        }
      }
    });
  }
  /* ------------------------------------------------------- */
  /*               Fetch Product List By Category           */
  /* ------------------------------------------------------- */
  fetchProductList() {
    this.getProductListByRealTimeDataBase();
    this.filterProductsByCategory();
  }
}
