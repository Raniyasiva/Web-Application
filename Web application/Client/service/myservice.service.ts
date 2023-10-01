import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MyserviceService {

  constructor(private http:HttpClient) {
  }
  post(data:any){
    return this.http.post(' http://localhost:5000/signup',data);
  }
  postlogin(data:any){
    return this.http.post(' http://localhost:5000/login',data);
  }
  getItems(){
    return this.http.get('http://localhost:5000/dashboard');
  }
  checkToggle(data:any){
    console.log('Sending POST request to http://localhost:5000/uncheck with data:', data);

 return this.http.post('http://localhost:5000/uncheck',data);
  }
  deleteTable(data:any){
    return this.http.post('http://localhost:5000/delete',data);
  }
}
