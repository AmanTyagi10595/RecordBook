import { Component, OnInit } from "@angular/core";
import { AuthServiceService } from "./../auth-service.service";
import { FormBuilder } from "@angular/forms";
import { ConditionalExpr } from "@angular/compiler";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { AlertsService } from "../services/alerts.service";
import { UploadfilesService } from "../services/uploadfiles.service";

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
  minDate: any;
  customerBalance: number;
  selectedFile: File;
  // userEmail: string = "";
  constructor(
    private service: AuthServiceService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private alerts: AlertsService,
    private Uploadfiles: UploadfilesService
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
      if (params && params.email) {
        console.log("params", params);
        this.obj.email = params.email;
        this.saleRecord.patchValue({
          email: params.email
        });
        this.getCustomerBalance();
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
      // console.log("sale record", result);
      this.oneCustomerSale = result["msg"];
    });
  }
  getAllUsersSale() {
    this.service.getAllUsersSale().subscribe(result => {
      // console.log("sale record", result);
      this.oneCustomerSale = result["msg"];
    });
  }
  onAddSale() {
    const uploadData = new FormData();
    this.saleRecord.value.notifie = this.mySwitch;
    uploadData.append("imgUploader", this.selectedFile);
    uploadData.append("test", JSON.stringify(this.saleRecord.value));
    this.service.addSalesData(uploadData).subscribe(
      result => {
        console.log("result", result);
        this.alerts.sucessAlert(this.saleRecord.value.email);
        this.saleRecord.reset();
        if (this.obj.email) {
          this.getOneUserSale();
        } else {
          this.getAllUsersSale();
        }
      },
      err => {
        this.alerts.failureAlert();
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
    this.alerts.deleteComfirm().then(result => {
      if (result.value) {
        this.service.deleteOneSale(_id).subscribe(
          result => {
            Swal.fire("Deleted!", "This sale has been deleted.", "success");
            this.getOneUserSale();
          },
          err => {
            console.error("not deleted");
            this.alerts.failureAlert();
          }
        );
      }
    });
  }
  onSelectSaleDate(event) {
    this.minDate = this.saleRecord.value.sale_date;
  }
  getCustomerBalance() {
    this.service.getCustomerBalance(this.obj.email).subscribe(
      result => {
        console.log("balance ", result);
        this.customerBalance = result[0].balance;
      },
      err => {
        console.error("not deleted", err);
      }
    );
  }
  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    console.log("selectedFile", this.selectedFile);
  }
  upload() {
    const uploadData = new FormData();
    uploadData.append("imgUploader", this.selectedFile);
    uploadData.append("test", JSON.stringify(this.saleRecord.value));
    console.log(this.saleRecord.value);
    console.log(uploadData);
    this.service.uploadFile(uploadData).subscribe(
      result => {
        console.log("result", result);
      },
      err => {
        console.error("not deleted", err);
      }
    );
  }
}
