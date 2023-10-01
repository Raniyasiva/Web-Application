import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyserviceService } from '../service/myservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  hide = true;
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  loginClicked = false;
  signupPage: FormGroup;
  district: string[] = [
    'Kanyakumari', 'Chennai', 'Coimbatore', 'Tiruchy', 'Tirunelveli'
  ];
  
  constructor(private fb:FormBuilder,private service:MyserviceService, private router: Router){
    this.signupPage = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z]*')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      phone:['',[Validators.required,Validators.maxLength(10)]],
     gender: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      district: ['', [Validators.required]],
      comment: ['', Validators.required]
    });
  }
  onSubmit(){
    console.log(this.signupPage.valid);
    
    if (this.signupPage.valid) {
      const signupdata = this.signupPage.value;
      const datastringify= JSON.stringify(signupdata);
      this.service.post(datastringify).subscribe(
        (res: any) => {     
          if(res.status==1){
            alert(res.message);
          }
            this.signupPage.reset();        
        },
        (error) => {     
          alert('Signup failed. Please try again later.');
        }    
      );
      this.router.navigate(['login']);
    }
    else{
      console.log('Form not valid');
      
    }
}
}
/*  <div class="row">
          <mat-radio-group aria-label="Select an option" formControlName="gender">
              <mat-label><b>Gender</b></mat-label>
              <mat-radio-button value="male">Male</mat-radio-button>
              <mat-radio-button value="female">Female</mat-radio-button>
              <mat-radio-button value="others">Others</mat-radio-button>
          </mat-radio-group>
          <div *ngIf="signupPage.get('gender')?.invalid && signupPage.get('gender')?.touched" class="danger">
              <div *ngIf="signupPage.get('gender')?.errors?.['required']">Gender Required!!</div>
          </div>
        </div>
       

       

        */