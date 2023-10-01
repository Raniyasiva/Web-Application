import { Component, OnInit } from '@angular/core';
import { MyserviceService } from '../service/myservice.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dataSource: any[];

  constructor(private service: MyserviceService, private http: HttpClient) {
    this.dataSource = [];
  }

  ngOnInit(): void {
    this.service.getItems().subscribe(
      (res: any) => {
        if (res.status === 1) {
          this.dataSource = res.records;
          console.log(this.dataSource);
        } else {
          console.error('Invalid in the response:', res);
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }



  toggle(item:any) {
  const email = item.email;
  const isActive = item.isActive ? 1 : 0;
  const activedata = { email, isActive };
  const activestringify=JSON.stringify(activedata);
  console.log(activedata);
    this.service.checkToggle(activestringify).subscribe(
        (res: any) => {

          console.log(res);
          if(res.status==1){
          alert(res.message);
          //location.reload();
          }
        },
        (err: any) => {
          console.error('Toggle action failed', err);
          alert('Action failed');
        }
      );
    } 
    delete(item:any){
      const email=item.email;
      const deleteEmail={email};
      const datastringify=JSON.stringify(deleteEmail);
      this.service.deleteTable(datastringify).subscribe(
        (res:any)=>{
          console.log(res);
          if(res.status==1){
            alert(res.message)
            console.log(res.message);
            location.reload();
          }
        },
          (error:any)=>{
            console.error('Error',error);
            alert('Failed to delete')
          }     
      )
  }
}