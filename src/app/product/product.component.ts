import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  constructor (private http: HttpClient) {
  }

  products: Product[] = [];

  ngOnInit(): void {
    this.LoadProduct();
  }

  async LoadProduct() {
    this.http.get<Product[]>("https://api.restful-api.dev/objects").subscribe((res) => {
      this.products = res;
    });
  }

  SaveProduct(){
    alert("saved!");
  }
}

export class ProductData {
  generation: string;
  price: string;

  constructor() {
    this.generation = "";
    this.price = "";
  }
}

export class Product {
  id: string;
  name: string;
  data: ProductData;

  constructor() {
    this.id = "";
    this.name = "";
    this.data = new ProductData();
  }
}