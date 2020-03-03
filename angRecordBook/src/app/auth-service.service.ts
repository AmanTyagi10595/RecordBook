import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
@Injectable({
  providedIn: "root"
})
export class AuthServiceService {
  constructor(private http: HttpClient) {}

  url = "http://localhost:4000/";
  addCustomer(obj) {
    return this.http.post(`${this.url}customer/add`, obj, httpOptions);
  }
  getAllCustomer() {
    return this.http.get(`${this.url}customer`, httpOptions);
  }
  getOneUserSale(obj) {
    return this.http.get(`${this.url}saleRecord/${obj.email}`, httpOptions);
  }
  setSalesData(obj) {
    return this.http.post(`${this.url}saleRecord/add`, obj, httpOptions);
  }
}
