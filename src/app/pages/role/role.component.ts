import { Component, inject } from '@angular/core';
import { RoleFormComponent } from "../../components/role-form/role-form.component";
import { RoleService } from '../../services/role.service';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { AsyncPipe } from '@angular/common';
import { RoleAssignComponent } from '../../components/role-assign/role-assign.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [RoleFormComponent,RoleListComponent,MatInputModule,RoleAssignComponent,MatSelectModule,MatFormFieldModule,AsyncPipe,MatSnackBarModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
  roleService=inject(RoleService);
  authservice= inject(AuthService);
  users$= this.authservice.getAll();
  selectedUser:string='';
  selectedRole:string='';
  errorMessage= '';
  role:RoleCreateRequest ={} as RoleCreateRequest;
  roles$ = this.roleService.getRoles();
  snackBar=inject(MatSnackBar);

  createRole(role:RoleCreateRequest){
    this.roleService.createRoles(role).subscribe({
      next:(response:{message:string})=>{
        this.roles$=this.roleService.getRoles();
        this.snackBar.open("Role Create Successfull",'OK',{
          duration:5000,
        });
       // this.roleService.getRoles();

        },
        error:(error:HttpErrorResponse)=>{
          if(error.status==400){
            this.errorMessage= error.error;
          }
        }
    })
  }
   deleteRole(id:string){
     this.roleService.deleteRole(id).subscribe({
      next : (response :{message:string})=>{
        this.roles$=this.roleService.getRoles();
        this.snackBar.open("Role delete successfully. ","Close",{
          duration:3000,
        })
        //this.roleService.getRoles();
      },
      error: (error :HttpErrorResponse)=>{
        if(error.status==400){
          this.errorMessage=error.error;
        }
      }
     })
   }
  assignRole(){
    this.roleService.assignRole(this.selectedUser,this.selectedRole).subscribe({
      next : (response :{message:string})=>{
        this.roles$=this.roleService.getRoles();
        this.snackBar.open("Role delete successfully. ","Close",{
          duration:3000,
        })
       
      },
      error: (error :HttpErrorResponse)=>{
        if(error.status==400){
          this.errorMessage=error.error;
        }
      }
    })
  }
}
