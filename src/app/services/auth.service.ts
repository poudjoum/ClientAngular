import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail} from '../interfaces/user-detail';

import { ChangePasswordRequest } from '../interfaces/change-password-request';
import { ResetPasswordComponent } from '../pages/reset-password/reset-password.component';
import { ResetPasswordRequest } from '../interfaces/reset-password-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl:string =environment.apiUrl;
  
  private userKey='user';

  constructor(private http: HttpClient) { }
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/account/login`, data)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.userKey, JSON.stringify(response));
          }
          return response;
        }),
        catchError((error) => {
          console.error('Erreur de connexion', error);
          return throwError(() => new Error('Erreur de connexion'));
        })
      );
  }
  isLoggedIn =():boolean=>{
    const token=this.getToken();
    if(!token) return false;
    return true;
  }
  private isTokenExpired(){
    const token=this.getToken();
    if(!token)return true;
    const decoded=jwtDecode(token);
    const isTokenExpired=Date.now() >= decoded['exp']!*1000;
    //if(isTokenExpired) this.logout();
    return true;
  }
  getUserDetail=()=>{
    const token=this.getToken();
    if(!token) return null;
    const decodedToken:any = jwtDecode(token);
    const userDetail={
      id:decodedToken.nameid,
      fullName:decodedToken.name,
      email:decodedToken.email,
      roles:decodedToken.role || []
    }
    return userDetail;
  }
  logout=():void =>{
    
    localStorage.removeItem(this.userKey);
  }
   getToken=(): string | null =>{
    const user =localStorage.getItem(this.userKey);
    if(!user) return null;
    const userDetail:AuthResponse =JSON.parse(user);
    return userDetail.token;
   }

   getRefreshToken=(): string | null =>{
    const user =localStorage.getItem(this.userKey);
    if(!user) return null;
    const userDetail:AuthResponse =JSON.parse(user);
    return userDetail.refreshToken;
   }

  register(data:RegisterRequest):Observable<AuthResponse> {
    return this.http
    .post<AuthResponse>(`${this.apiUrl}/account/register`,data)
    .pipe(
      map((response)=>{
        if(response.isSuccess){
          localStorage.setItem(this.userKey,response.token.toString());
        }
        return response;
      })
    )
  }
   getDetail = ():Observable<UserDetail>=>{

    return this.http.get<UserDetail>(`${this.apiUrl}/Account/details`);
   }
   getAll=():Observable<UserDetail[]>=>{

    return this.http.get<UserDetail[]>(`${this.apiUrl}/Account/account`);
   }
   getRoles =():String[] |null =>{
     const token = this.getToken();
     if(!token) return null;
     const decodedToken:any= jwtDecode(token);
     return decodedToken.role || null;
   }

   forgotPassword =(email:string):Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}/Account/forgot-password`,{email});


   resetPassword =(data:ResetPasswordRequest):Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}/Account/reset-password`,data);

   
   
   refreshToken =(data:{
    email:string;
    token:string;
    refreshToken:string;
   }):Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}/Account/refresh-token`,data);


   changePassword =(data:ChangePasswordRequest):Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}/Account/change-password`,data);
}