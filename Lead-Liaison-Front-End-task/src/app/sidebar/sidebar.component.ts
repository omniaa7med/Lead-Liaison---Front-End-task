import { Component, OnInit } from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductListService } from '../service/product-list.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  /* ------------------------------------------------------- */
  /*                         Variables                       */
  /* ------------------------------------------------------- */
  allLength!: Number;
  simpleLength!: Number;
  complexLength!: Number;
  // category: string = 'all';
  products: Product[] = [];

  constructor(private ProductListService: ProductListService) {}

  ngOnInit(): void {
    this.getProductList();
  }
  /* ------------------------------------------------------- */
  /*                    Get Product List                     */
  /* ------------------------------------------------------- */
  getProductList() {
    if (JSON.parse(sessionStorage.getItem('ProductList') || '{}').length > 0) {
      this.products = JSON.parse(sessionStorage.getItem('ProductList') || '{}');
      this.FilterCategory();
    } else {
      this.ProductListService.getProductListByFireStore().subscribe((res) => {
        this.products = res.map((e: any) => {
          return {
            ...(e.payload.doc.data() as Product),
          };
        });
        this.FilterCategory();
        sessionStorage.setItem('ProductList', JSON.stringify(this.products));
      });
    }
  }

  /* ------------------------------------------------------- */
  /*           Filter Product List By Category               */
  /* ------------------------------------------------------- */
  FilterCategory() {
    if (this.products.length > 0) {
      this.allLength = this.products.length;
      this.simpleLength = this.products.filter((e) => {
        return e.category == 'simple';
      }).length;
      this.complexLength = this.products.filter((e) => {
        return e.category == 'complex';
      }).length;
    }
  }
  filterProducts(cate: string) {
    this.ProductListService.sendCategory(cate);
  }
}
