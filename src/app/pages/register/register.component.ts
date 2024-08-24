import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select'
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar} from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-error';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormField,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    AsyncPipe,
    CommonModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  authService =inject(AuthService);
  roleService=inject(RoleService);
  matSnackBar=inject(MatSnackBar);
  router =inject(Router);
  roles$!:Observable<Role[]>
  hide=true
  fb=inject(FormBuilder);
  registerForm!:FormGroup;
  errors!:ValidationError[];

  ngOnInit(): void {
    this.registerForm= this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]],
      fullName:['',[Validators.required]],
      roles:[''],
      confirmPassword:['',Validators.required]
    },{
      validators:this.passwordMatchValidator,
    }
    );
    this.roles$ = this.roleService.getRoles();
  }
  
  register() {
    this.authService.register(this.registerForm.value).subscribe({
      next:(response)=>{
        console.log(response);
         this.matSnackBar.open(response.message.toString(),'Close',{
          duration:5000,
          horizontalPosition:'center',
         });
         this.router.navigate(['/login']);
      },error:(err:HttpErrorResponse)=>{
        if(err!.status==400){
          this.errors=err!.error;
          this.matSnackBar.open('Validations Error','Close',{
            duration:5000,
            horizontalPosition:'center'
          })
        }
      },
      complete: ()=> console.log('Resgister success'),
    })

    

  }
  private passwordMatchValidator(control:AbstractControl):{[key:string]:boolean }| null{
    const password=control.get('password')?.value;
    const confirmPassword=control.get('confirmPassword')?.value;
    if(password != confirmPassword){
      return {passwordMismatch:true};
    }
    return null;
  }
}




