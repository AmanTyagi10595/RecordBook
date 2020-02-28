import { Component, OnInit } from "@angular/core";
import { AuthServiceService } from "./../auth-service.service";

@Component({
  selector: "app-product-sales",
  templateUrl: "./product-sales.component.html",
  styleUrls: ["./product-sales.component.css"]
})
export class ProductSalesComponent implements OnInit {
  totalCustomers: any = ["q", "e", "d", "f"];
  obj = {
    email: "abhay@gmail.com"
  };
  oneCustomerSale = [];
  constructor(private service: AuthServiceService) {}

  ngOnInit() {
    this.getOneUserSale();
  }

  getOneUserSale() {
    this.service.getOneUserSale(this.obj).subscribe(result => {
      this.oneCustomerSale = result["msg"];
      console.log("data", this.oneCustomerSale);
    });
  }
}
