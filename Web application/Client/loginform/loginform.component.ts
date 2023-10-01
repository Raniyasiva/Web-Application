import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyserviceService } from '../service/myservice.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.css']
})
export class LoginformComponent {
  hide = true;
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  loginClicked = false;
  loginPage: FormGroup;


  constructor(private fb:FormBuilder ,private service:MyserviceService,private router:Router){
    this.loginPage = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
   
    });
  }
  onSubmit(){
    console.log(this.loginPage.valid);
    
    if (this.loginPage.valid) {
      const logindata = this.loginPage.value;
      const datastringify= JSON.stringify(logindata);
      console.log(datastringify);
      
      this.service.postlogin(datastringify).subscribe(
        (res: any) => {    
          console.log(res);          
          //const parseData = JSON.parse(res);
          if(res.status===1 || res.status===0){
          alert(res.message); 
            this.loginPage.reset();
            if(res.status===1){
            this.router.navigate(['dashboard']); 
            }
          }               
         },
        (error) => {     
          alert('Invalid User');
        }
      );
    }
  }
  }