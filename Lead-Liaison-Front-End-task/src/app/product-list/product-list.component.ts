import { Component, OnInit } from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductListService } from '../service/product-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  constructor(private productService: ProductListService) { }
  products: Product[] = [];
  ngOnInit(): void {
    this.productService.getProductList().subscribe((data: any) => {
      this.products = Object.keys(data).map((key) => data[key])
      console.log(this.products);
      localStorage.setItem('ProductList', JSON.stringify(this.products))
    });

    this.productService.cateroryType.subscribe(e => {
      console.log(JSON.parse(localStorage.getItem('ProductList') || '{}'));
      this.products = JSON.parse(localStorage.getItem('ProductList') || '{}')
      if (e != 'all') {
        this.products = this.products.filter(prod => prod.category === e);
        console.log(this.products);
      }
    })
    // this.productService.getUserList().subscribe((res) => {
    //   console.log(res.map((e) => {
    //     return {
    //       // iD: e.payload.doc.id,
    //       ...(e.payload.doc.data() as Product),
    //     };
    //   }));
    // });
  }

}
