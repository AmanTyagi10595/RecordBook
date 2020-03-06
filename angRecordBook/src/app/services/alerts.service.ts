import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root"
})
export class AlertsService {
  constructor() {}

  sucessAlert(email) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Sale added to  <span style="color:#3385ff">${email}<span>.`,
      showConfirmButton: false,
      timer: 2500
    });
  }
  failureAlert() {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: `Oops...`,
      showConfirmButton: false,
      text: "Something went wrong!",
      timer: 2500
    });
  }
  deleteComfirm(): Promise<any> {
    return Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });
  }
}
