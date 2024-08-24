import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { RoleListComponent } from '../role-list/role-list.component';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [MatFormFieldModule,RoleListComponent,MatInputModule,MatButtonModule,FormsModule],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.css'
})
export class RoleFormComponent {
  @Input({required:true}) role!:RoleCreateRequest;
  @Input() errorMessage!:string
  @Input () message!:string;
  @Output() addRole:EventEmitter<RoleCreateRequest>= new EventEmitter<RoleCreateRequest>();

  add(){
     this.addRole.emit(this.role);
  }

}
