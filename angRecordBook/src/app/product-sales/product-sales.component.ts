import { Component, OnInit } from "@angular/core";
import { AuthServiceService } from "./../auth-service.service";
import { FormBuilder } from "@angular/forms";
import { ConditionalExpr } from "@angular/compiler";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";

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
  saleRecord: any;
  mySwitch: boolean = true;
  constructor(private service: AuthServiceService, private fb: FormBuilder) {
    this.saleRecord = this.fb.group({
      amount: [""],
      payed: [""],
      saleDate: [""],
      proDate: [""]
    });
  }

  ngOnInit() {
    this.getOneUserSale();
  }

  getOneUserSale() {
    this.service.getOneUserSale(this.obj).subscribe(result => {
      this.oneCustomerSale = result["msg"];
      console.log("data", this.oneCustomerSale);
    });
  }
  onAddSale() {
    console.log(this.saleRecord.value);
  }

  changeDate(data) {
    console.log("d", data);
  }
}
