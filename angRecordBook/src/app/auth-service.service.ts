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
    console.log("testing", obj);
    return this.http.post(`${this.url}customer/add`, obj);
  }
  getAllCustomer() {
    return this.http.get(`${this.url}customer`, httpOptions);
  }
  getOneUserSale(obj) {
    return this.http.get(`${this.url}saleRecord/${obj.email}`, httpOptions);
  }
  addSalesData(obj) {
    console.log("in service", obj);
    return this.http.post(`${this.url}saleRecord/add`, obj);
  }
  getAllUsersSale() {
    return this.http.get(`${this.url}saleRecord`, httpOptions);
  }
  getLikeCustomer(data) {
    return this.http.get(`${this.url}customer/like?data=` + data, httpOptions);
  }
  deleteOneSale(_id) {
    return this.http.delete(`${this.url}saleRecord/delete/${_id}`, httpOptions);
  }
  getCustomerBalance(email) {
    return this.http.get(`${this.url}customer/balance/${email}`, httpOptions);
  }
  deleteCustomer(obj) {
    return this.http.post(`${this.url}customer/delete/`, obj);
  }
  uploadFile(files) {
    return this.http.post(`${this.url}api/Upload`, files);
  }
  notifieSingleCustomer(obj) {
    return this.http.post(`${this.url}customer/notifyOneCustomer`, obj);
  }
}
