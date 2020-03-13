import { AuthServiceService } from "./../auth-service.service";
import { Component, OnInit } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder } from "@angular/forms";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { FileUploader, FileLikeObject } from "ng2-file-upload";
import { AlertsService } from "../services/alerts.service";
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
  totalCustomers: any = [];
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
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: AuthServiceService,
    private alerts: AlertsService
  ) {}

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
    this.service.getAllCustomer().subscribe(
      result => {
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
}
