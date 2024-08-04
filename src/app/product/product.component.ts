import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild("modalAddEdit") modalAddEdit : ElementRef | undefined;

  products: Product[] = [];
  product: Product = new Product();
  headers = new HttpHeaders({
    contentType: "application/json"
  });

  ngOnInit(): void {
    this.LoadProduct();
  }

  async LoadProduct() {
    this.http.get<Product[]>("https://api.restful-api.dev/objects").subscribe(res => {
      this.products = res;
    });
  }

  AddEditProduct(product?: Product){
    if (this.modalAddEdit != null) {
      if (product == null) {
        this.product = new Product();
      }
      else
      {
        this.product = product;
      }
     
      this.modalAddEdit.nativeElement.style.display = "block";
    }
  }

  SaveProduct(){ 
    if (this.modalAddEdit != null) {
      if (this.product.id == "")
      {
        this.http.post("https://api.restful-api.dev/objects", { name: this.product.name}, { headers: this.headers }).subscribe(res => {
          if (res != null)
          {
            console.log(res);
            alert("Successfully added");
          }       
        });
      }
      else
      {
        this.http.put("https://api.restful-api.dev/objects/" + this.product.id, { name: this.product.name}, { headers: this.headers }).subscribe(res => {
          if (res != null)
          {
            console.log(res);
            alert("Successfully updated");
          }       
        });
      }

      this.modalAddEdit.nativeElement.style.display = "none";
    }
  }

  DeleteProduct(product: Product){
    if (this.modalAddEdit != null) {
      this.http.delete("https://api.restful-api.dev/objects/" + "ff808181911c9fd801911d25b58a0073").subscribe(res => {
        if (res != null)
        {
          console.log(res);
          alert("Successfully deleted");
        } 
      });

      this.modalAddEdit.nativeElement.style.display = "none";
    }
  }

  CloseAddEdit(){
    if (this.modalAddEdit != null) {
      this.modalAddEdit.nativeElement.style.display = "none";
    }
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