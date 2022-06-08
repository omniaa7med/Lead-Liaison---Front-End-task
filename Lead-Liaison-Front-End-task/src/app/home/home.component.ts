import { Component, OnInit } from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductListService } from '../service/product-list.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductListService) {
    this.products = this.productService.getFromSessionStorage();
  }

  ngOnInit(): void {}
  ngDoCheck(): void {
    if (this.products.length === 0) {
      this.products = this.productService.getFromSessionStorage();
    }
  }
}
