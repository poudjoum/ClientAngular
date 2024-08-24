import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail} from '../interfaces/user-detail';
import { ResetPasswordRequest } from '../interfaces/reset-password-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl:string =environment.apiUrl;
  private tokenKey='token'
  constructor(private http: HttpClient) { }
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/account/login`, data)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.tokenKey, response.token.toString());
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
    return !this.isTokenExpired();
  }
  private isTokenExpired(){
    const token=this.getToken();
    if(!token)return true;
    const decoded=jwtDecode(token);
    const isTokenExpired=Date.now() >= decoded['exp']!*1000;
    if(isTokenExpired) this.logout();
    return isTokenExpired
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
    localStorage.removeItem(this.tokenKey);
  }
   getToken=(): string | null =>localStorage.getItem(this.tokenKey) || '';
  register(data:RegisterRequest):Observable<AuthResponse> {
    return this.http
    .post<AuthResponse>(`${this.apiUrl}/account/register`,data)
    .pipe(
      map((response)=>{
        if(response.isSuccess){
          localStorage.setItem(this.tokenKey,response.token.toString());
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
}