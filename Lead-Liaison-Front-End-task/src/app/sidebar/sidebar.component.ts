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
  allLength: Number = 0;
  simpleLength: Number = 0;
  complexLength: Number = 0;
  // category: string = 'all';
  products: Product[] = [];

  constructor(private ProductListService: ProductListService) { }

  ngOnInit(): void {
    this.getProductList();
  }


  /* ------------------------------------------------------- */
  /*                    Get Product List                     */
  /* ------------------------------------------------------- */
  getProductList() {
    this.products = JSON.parse(localStorage.getItem('ProductList') || '{}');
    this.allLength = this.products.length;
    this.simpleLength = this.products.filter((e) => {
      return e.category == 'simple';
    }).length;
    this.complexLength = this.products.filter((e) => {
      return e.category == 'complex';
    }).length;
  }

  /* ------------------------------------------------------- */
  /*           Filter Product List By Category               */
  /* ------------------------------------------------------- */
  filterProducts(cate: string) {
    // this.category = cate
    this.ProductListService.getCategory(cate);
  }
}
