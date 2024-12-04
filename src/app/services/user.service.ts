import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { BankResponse } from '../model/bank-response';
import { Login } from '../model/login';
import { PasswordUpdate } from '../model/password-update';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/user/';

  constructor(private http:HttpClient) { }

  registerUser(user:User): Observable<BankResponse>{
    return this.http.post<BankResponse>(this.apiUrl+"create",user);
  }

  loginUser(login:Login): Observable<BankResponse>{
    return this.http.post<BankResponse>(this.apiUrl+"login",login);
  }
  
  updatePassword(passwordRequest:PasswordUpdate): Observable<BankResponse>{
    return this.http.patch<BankResponse>(this.apiUrl+"passwordUpdate",passwordRequest);
  }
}
