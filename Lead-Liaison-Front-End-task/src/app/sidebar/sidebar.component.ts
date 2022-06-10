import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { Product } from '../interfaces/product';
import { ProductListService } from '../service/product-list.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  /* ------------------------------------------------------- */
  /*                         Variables                       */
  /* ------------------------------------------------------- */

  allLength!: Number;
  simpleLength!: Number;
  complexLength!: Number;
  category: string = 'all';
  products: Product[] = [];
  unsubscribe$ = new Subject<void>();

  constructor(private ProductListService: ProductListService) {}

  ngOnInit(): void {
    this.getProductList();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  /* ------------------------------------------------------- */
  /*                    Get Product List                     */
  /* ------------------------------------------------------- */

  getProductList() {
    // if (this.ProductListService.getFromSessionStorage().length > 0) {
    this.products = this.ProductListService.getFromSessionStorage();
    this.ByFilterCategory();
    // } else {
    //   this.ProductListService.getProductListByRealTime()
    //     .snapshotChanges()
    //     .pipe(
    //       map((changes) =>
    //         changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
    //       ),
    //       takeUntil(this.unsubscribe$)
    //     )
    //     .subscribe((data: any) => {
    //       this.products = data;
    //       this.ProductListService.setIntSessionStorage(this.products);
    //       this.ByFilterCategory();
    //     });
    // }
  }

  /* ------------------------------------------------------- */
  /*           Filter Product List By Category               */
  /* ------------------------------------------------------- */

  ByFilterCategory() {
    if (this.products.length > 0) {
      this.allLength = this.products.length;
      this.simpleLength = this.products.filter(e => {
        return e.category == 'simple';
      }).length;
      this.complexLength = this.products.filter(e => {
        return e.category == 'complex';
      }).length;
    }
  }

  filterProducts(cate: string) {
    this.ProductListService.sendCategory(cate);
  }
}
