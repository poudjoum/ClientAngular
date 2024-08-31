import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccountComponent } from './pages/account/account.component';
import { authGuard } from './gaurds/auth.guard';
import { UsersComponent } from './pages/users/users.component';
import { roleGuard } from './gaurds/role.guard';
import { RoleComponent } from './pages/role/role.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

export const routes: Routes = [
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'',
        component:HomeComponent
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'account/:id',
        component:AccountComponent,
        canActivate:[authGuard],
    }
    ,
    
    
    {
        path:'forgot-password',
        component:ForgotPasswordComponent,
        
    },
    {
        path:'change-password',
        component:ChangePasswordComponent,
        canActivate:[authGuard]
        
    }
    ,
    {
        path:'users',
        component:UsersComponent,
        canActivate:[roleGuard],
        data:{
            roles:['Admin','SysAdmin'],
        }
    },
    
    {
        path:'roles',
        component:RoleComponent,
        canActivate:[roleGuard],
        data:{
            roles:['Admin','SysAdmin'],
        }
    }
]
