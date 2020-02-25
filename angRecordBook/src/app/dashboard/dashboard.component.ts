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
  constructor(private modalService: NgbModal, private fb: FormBuilder) {}

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
      mobile: ["", Validators.minLength(10)],
      address: [""],
      email: ["", [Validators.email, Validators.required]]
    });
  }
  onAddCustomers() {
    console.log("Input :", this.profileForm.status);
    console.log("Input :", this.profileForm.get("email"));
    if (this.profileForm.status == "VALID") {
      console.warn("Form is OK");
      this.modalRef.close();
    } else {
      console.error("Invalid Form");
    }
  }
}
