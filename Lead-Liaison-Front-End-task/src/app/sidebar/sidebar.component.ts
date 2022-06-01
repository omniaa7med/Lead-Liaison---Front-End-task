import { Component, OnInit } from '@angular/core';
import { ProductListService } from "../service/product-list.service";
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private ProductListService: ProductListService) { }

  ngOnInit(): void {
  }
  allLength = 5;
  simpleLength = 3;
  complexLength = 2;
  category: string = 'all';

  filterProducts(cate: string) {
    console.log(cate);
    this.category = cate
    // console.log(this.ProductListService.sendType(cate));
    this.ProductListService.sendType(cate)
  }
}
