import { Component, OnInit } from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductListService } from '../service/product-list.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(private productService: ProductListService) {}

  ngOnInit(): void {}

  goHome(cate: string) {
    this.productService.sendCategory(cate);
  }
}
