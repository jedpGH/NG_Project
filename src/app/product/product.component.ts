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

  product: Product = new Product();
  products: Product[] = [];
  newproducts: Product[] = [];

  headers = new HttpHeaders({
    contentType: "application/json"
  });

  ngOnInit(): void {
    this.LoadProduct();
  }

  LoadProduct() {
    this.http.get<Product[]>("https://api.restful-api.dev/objects").subscribe(res => {
      this.products = res;

      let newproducts = sessionStorage.getItem("newproducts");

      if (newproducts != null)
      {
        this.newproducts = JSON.parse(newproducts);

        if (this.newproducts.length > 0) {
          this.newproducts.forEach(newproduct => {
            this.products.push(newproduct);
          });
        }
      }
    },
    ex => {
      console.log(ex);
      alert("Unable to load!");
    });
  }

  AddEditProduct(product?: Product) {
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

  SaveProduct(product: Product) { 
    if (this.modalAddEdit != null) {
      if (product.id == "") {
        this.http.post<Product>("https://api.restful-api.dev/objects", { name: product.name}, { headers: this.headers }).subscribe(res => {
          if (res != null) {
            console.log(res);

            let newproduct = res;
            this.newproducts.push(newproduct);
            sessionStorage.setItem("newproducts", JSON.stringify(this.newproducts));

            alert("succesfully added!");
            this.LoadProduct();
          }       
        },
        ex => {
          console.log(ex);
          alert("Unable to add!");
        });
      }
      else {
        this.http.put<Product>("https://api.restful-api.dev/objects/" + product.id, { name: product.name}, { headers: this.headers }).subscribe(res => {
          if (res != null)
          {
            console.log(res);

            this.newproducts[this.newproducts.indexOf(product)] = res;
            sessionStorage.setItem("newproducts", JSON.stringify(this.newproducts));

            alert("succesfully edited!");
            this.LoadProduct();
          }       
        },
        ex => {
          console.log(ex);
          alert("Unable to edit!");
        });
      }

      this.modalAddEdit.nativeElement.style.display = "none";
    }
  }

  DeleteProduct(product: Product) {
    this.http.delete("https://api.restful-api.dev/objects/" + product.id).subscribe(res => {
      if (res != null) {
        console.log(res);

        this.newproducts.splice(this.newproducts.indexOf(product), 1)
        sessionStorage.setItem("newproducts", JSON.stringify(this.newproducts));

        alert("successfully deleted!");
        this.LoadProduct();
      } 
    },
    ex => {
      console.log(ex);
      alert("Unable to delete!");
    });
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