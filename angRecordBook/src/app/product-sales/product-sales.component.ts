import { Component, OnInit } from "@angular/core";
import { AuthServiceService } from "./../auth-service.service";
import { FormBuilder } from "@angular/forms";
import { ConditionalExpr } from "@angular/compiler";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-product-sales",
  templateUrl: "./product-sales.component.html",
  styleUrls: ["./product-sales.component.css"]
})
export class ProductSalesComponent implements OnInit {
  today = new Date();
  allCustomersEmail = [];
  result: any = [];
  obj = {
    email: ""
  };
  oneCustomerSale = [];
  saleRecord: any;
  mySwitch: boolean = true;
  // userEmail: string = "";
  constructor(
    private service: AuthServiceService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.saleRecord = this.fb.group({
      amount: [""],
      payedAmout: [""],
      sale_date: [""],
      promis_date: [""],
      email: [""]
    });
    this.today.setDate(this.today.getDate());
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params) {
        this.obj.email = params.email;
        this.saleRecord.patchValue({
          email: params.email
        });
      }
      if (this.obj.email) {
        this.getOneUserSale();
      } else {
        this.getAllUsersSale();
      }
    });
  }

  getOneUserSale() {
    this.service.getOneUserSale(this.obj).subscribe(result => {
      this.oneCustomerSale = result["msg"];
    });
  }
  getAllUsersSale() {
    this.service.getAllUsersSale().subscribe(result => {
      this.oneCustomerSale = result["msg"];
    });
  }
  onAddSale() {
    this.saleRecord.value.notifie = this.mySwitch;
    this.service.addSalesData(this.saleRecord.value).subscribe(
      result => {
        console.log("result", result);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Sale added to ${this.saleRecord.value.email}`,
          showConfirmButton: false,
          timer: 2000
        });
        if (this.obj.email) {
          this.getOneUserSale();
        } else {
          this.getAllUsersSale();
        }
      },
      err => {
        console.log("error: ", err);
      }
    );
  }
  async getUserEmail(event) {
    this.allCustomersEmail = [];
    if (event.target.value.length > 3) {
      await this.service.getLikeCustomer(event.target.value).subscribe(
        result => {
          this.result = result;
          this.result.forEach(e => {
            this.allCustomersEmail.push(e.email);
          });
        },
        err => {
          console.log("error: ", err);
        }
      );
    }
  }
  deleteOneSale(_id) {
    console.log("sale", _id);
    this.service.deleteOneSale(_id).subscribe(
      result => {
        console.log("deleted");
      },
      err => {
        console.error("not deleted");
      }
    );
  }
}
