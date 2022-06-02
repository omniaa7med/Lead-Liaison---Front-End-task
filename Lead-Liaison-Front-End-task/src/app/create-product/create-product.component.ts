import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../interfaces/product';
import { ProductListService } from '../service/product-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent implements OnInit {
  /* ------------------------------------------------------- */
  /*                        Variables                        */
  /* ------------------------------------------------------- */
  reactiveForm!: FormGroup;
  products: Product[] = [];
  product: Product;
  imageSrc: string =
    'https://jshs.tu.edu.ly/wp-content/uploads/2020/02/placeholder.png';
  errorMessage: string = 'This field is required';
  constructor(
    private ProductListService: ProductListService,
    private router: Router
  ) {
    this.product = {} as Product;
  }

  ngOnInit(): void {
    console.log(this.ProductListService.createProduct(this.product));

    this.getProductList();
    this.reactiveForm = new FormGroup({
      name: new FormControl(this.product.name, [Validators.required]),
      category: new FormControl(this.product.category, [Validators.required]),
      slug: new FormControl(this.product.slug, [Validators.required]),
      price: new FormControl(this.product.price, [Validators.required]),
      file: new FormControl('', [Validators.required]),
      fileSource: new FormControl('', [Validators.required]),
    });
  }
  /* ------------------------------------------------------- */
  /*                Upload Product Image Functionality       */
  /* ------------------------------------------------------- */
  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageSrc = reader.result as string;

        this.reactiveForm.patchValue({
          fileSource: reader.result,
        });
      };
    }
  }
  /* ------------------------------------------------------- */
  /*                    Handel Required validation           */
  /* ------------------------------------------------------- */
  get name() {
    return this.reactiveForm.get('name')!;
  }

  get category() {
    return this.reactiveForm.get('category')!;
  }

  get price() {
    return this.reactiveForm.get('price')!;
  }

  get slug() {
    return this.reactiveForm.get('slug')!;
  }
  /* ------------------------------------------------------- */
  /*                Get Category From Select                 */
  /* ------------------------------------------------------- */

  getCategory(e: any) {
    console.log(e);
    if (e.target.value !== '') {
      this.product.category = e.target.value;
      this.errorMessage = '';
    }
  }
  /* ------------------------------------------------------- */
  /*                Add New Product Form                     */
  /* ------------------------------------------------------- */
  addNewProduct(): void {
    console.log(this.products);

    this.reactiveForm.value.category = this.product.category;
    console.log(this.reactiveForm);
    if (this.reactiveForm.invalid) {
      for (const control of Object.keys(this.reactiveForm.controls)) {
        this.reactiveForm.controls[control].markAsTouched();
      }
    }
    let count: number = 0;
    for (const product of Object.values(this.reactiveForm.value)) {
      if (product) {
        count++;
      }
      if (count === 6) {
        this.createProduct();
      }
    }
  }
  /* ------------------------------------------------------- */
  /*                 Add New Product to DataBase             */
  /* ------------------------------------------------------- */
  createProduct() {
    this.product = {
      id: this.products.length + 1,
      name: this.reactiveForm.value.name,
      price: this.reactiveForm.value.price,
      imageUrl: this.reactiveForm.value.fileSource,
      slug: this.reactiveForm.value.slug,
      category: this.reactiveForm.value.category,
    };
    this.ProductListService.createProduct(this.product);
    this.getProductList();
    this.router.navigate(['']);
  }
  /* ------------------------------------------------------- */
  /*                 Get ProductList From DataBase            */
  /* ------------------------------------------------------- */
  getProductList() {
    this.ProductListService.getProductListByFireStore().subscribe((res) => {
      this.products = res.map((e: any) => {
        return {
          ...(e.payload.doc.data() as Product),
        };
      });
      sessionStorage.setItem('ProductList', JSON.stringify(this.products));
    });
  }
}
