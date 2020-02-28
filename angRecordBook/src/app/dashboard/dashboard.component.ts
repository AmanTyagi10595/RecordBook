import { AuthServiceService } from "./../auth-service.service";
import { Component, OnInit } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder } from "@angular/forms";
import { Validators, FormGroup, FormControl } from "@angular/forms";

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
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: AuthServiceService
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
    console.log("Input 1:", this.profileForm.value);
    console.log("Input :", this.profileForm.get("mobile"));
    let data = {
      mo_num: this.profileForm.value.mobile,
      address: this.profileForm.value.address,
      email: this.profileForm.value.email,
      name: this.profileForm.value.name
    };
    if (this.profileForm.status == "VALID") {
      console.warn("Form is OK");
      this.service.addCustomer(data).subscribe(result => {
        console.log("result:", result);
      });

      this.modalRef.close();
    } else {
      console.error("Invalid Form");
    }
  }
  getAllCustomer() {
    console.log("%c Get all customer data run ", "color:  #ff6600");
    this.service.getAllCustomer().subscribe(
      result => {
        this.totalCustomers = result;
      },
      err => {}
    );
  }
}
