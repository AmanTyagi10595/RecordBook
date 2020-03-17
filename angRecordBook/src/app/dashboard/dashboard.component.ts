import { AuthServiceService } from "./../auth-service.service";
import { Component, OnInit } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder } from "@angular/forms";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { FileUploader, FileLikeObject } from "ng2-file-upload";
import { AlertsService } from "../services/alerts.service";
import { Options, LabelType } from "ng5-slider";
import Swal from "sweetalert2";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  closeResult: string;
  data = "test";
  profileForm: FormGroup;
  modalRef: any;
  rangeNotifier: boolean = false;
  totalCustomers: any = [];
  dateRangeNotifier = false;
  public FilesUploader: FileUploader = new FileUploader({
    url: "http://localhost:3000/saleRecord/add",
    disableMultipart: true,
    allowedMimeType: [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/x-eps",
      "image/bmp",
      "application/illustrator",
      "image/tiff"
    ],
    autoUpload: false
  });

  //regarding date range picker
  dateRange: FormGroup;
  // rangesFooter = RangesFooter;
  inlineRange;

  //regarding range slider
  minValue: number = 1000;
  maxValue: number = 70000;
  options: Options = {
    floor: 0,
    ceil: 100000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min price:</b> ₹" + value;
        case LabelType.High:
          return "<b>Max price:</b> ₹" + value;
        default:
          return "₹" + value;
      }
    }
  };
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: AuthServiceService,
    private alerts: AlertsService
  ) {
    this.dateRange = fb.group({
      date: [{ begin: new Date(2020, 2, 10), end: new Date(2020, 2, 25) }]
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content);
    // this.modalRef = this.modalService.open(AbortModalComponent);
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  ngOnInit() {
    this.profileForm = this.fb.group({
      name: ["", Validators.required],
      mobile: [""],
      address: [""],
      email: ["", [Validators.email, Validators.required]]
    });
    this.getAllCustomer();
  }
  onAddCustomers() {
    let files = this.myFiles();
    const formData = new FormData();
    files.forEach(file => {
      formData.append("imgUploader", file.rawFile);
    });
    let data = {
      mo_num: this.profileForm.value.mobile,
      address: this.profileForm.value.address,
      email: this.profileForm.value.email,
      name: this.profileForm.value.name
    };
    formData.append("test", JSON.stringify(data));
    // if (this.profileForm.status == "VALID") {
    this.service.addCustomer(formData).subscribe(
      result => {
        if (result["msg"] == "uploadSave") {
          this.alerts.sucessAddCustomer(", image also");
          this.getAllCustomer();
        } else {
          this.alerts.sucessAddCustomer(",but image could't");
          this.getAllCustomer();
        }
      },
      err => {
        console.log("error", err);
      }
    );

    this.modalRef.close();
    // } else {
    // console.error("Invalid Form");
    // }
  }
  getAllCustomer() {
    this.rangeNotifier = false;
    this.service.getAllCustomer().subscribe(
      result => {
        console.log(result);
        this.totalCustomers = result;
      },
      err => {}
    );
  }
  myFiles() {
    console.log("yy", this.FilesUploader.queue);
    return this.FilesUploader.queue.map(fileItem => {
      return fileItem.file;
    });
  }
  deleteCustomer(email) {
    this.alerts
      .deleteComfirm()
      .then(result => {
        console.log("res", result);
        if (result && result.value) {
          let obj = {};
          obj["email"] = email;
          this.service.deleteCustomer(obj).subscribe(
            result => {
              console.log("result", result);
              if (result["status"] == "success") {
                this.alerts.successAlertDynamic("Deleted successfully");
                this.getAllCustomer();
              }
            },
            err => {
              console.log("error", err);
            }
          );
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }
  notifieCustomer(text) {
    let data = {};
    data["name"] = text.name;
    data["email"] = text.email;
    data["balance"] = text.balance;
    this.service.notifieSingleCustomer(data).subscribe(
      result => {
        this.alerts.successAlertDynamic("Notification Send");
      },
      err => {
        this.alerts.failureAlertDynamic("Invalid Email");
      }
    );
  }
  getRangedCustomer() {
    let obj = { minValue: this.minValue, maxValue: this.maxValue };
    this.service.getRangedCustomers(obj).subscribe(
      result => {
        this.totalCustomers = result["msg"];
        this.rangeNotifier = true;
      },
      err => {
        console.log(err);
        this.alerts.failureAlert();
      }
    );
  }
  notifieRangedCustomer() {
    this.dateRangeNotifier = false;
    let data = [];
    this.totalCustomers.forEach(element => {
      let obj = {};
      obj["email"] = element.email;
      obj["name"] = element.name;
      obj["balance"] = element.balance;
      if (element.maxPromDate) {
        obj["maxPromDate"] = element.maxPromDate;
      }
      data.push(obj);
    });
    this.service.notifieRangedCustomers(data).subscribe(
      result => {
        if (result["status"] == "success") {
          this.alerts.successAlertDynamic("All selected users Notified !");
        }
      },
      err => {
        console.log(err);
        this.alerts.failureAlert();
      }
    );
  }
  inlineRangeChange(event) {
    let data = event.target.value;
    let obj = {};
    obj["minValue"] = data.begin;
    obj["maxValue"] = data.end;

    this.service.dateRangedCustomers(obj).subscribe(
      result => {
        console.log(result);

        let array = [];
        result["msg"].forEach(element => {
          element.userinfo[0]["maxPromDate"] = element.maxPromDate;
          array.push(element.userinfo[0]);
        });
        console.log(array);
        this.totalCustomers = array;
        this.dateRangeNotifier = true;
      },
      err => {
        console.log(err);
      }
    );
  }
}
