import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDto } from '../model/userdto';
import { BankResponse } from '../model/bank-response';
import { Login } from '../model/login';
import { PasswordUpdate } from '../model/password-update';
import { User } from '../model/user';
import { Transaction } from '../model/transaction';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/user/';

  constructor(private http: HttpClient) {}

  registerUser(user: UserDto): Observable<BankResponse> {
    return this.http.post<BankResponse>(this.apiUrl + 'create', user);
  }

  loginUser(login: Login): Observable<BankResponse> {
    return this.http.post<BankResponse>(this.apiUrl + 'login', login);
  }

  updatePassword(passwordRequest: PasswordUpdate): Observable<BankResponse> {
    return this.http.patch<BankResponse>(
      this.apiUrl + 'passwordUpdate',
      passwordRequest
    );
  }

  fetchAccount(email: string): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}fetchAccount/${encodeURIComponent(email)}`
    );
  }

  fetchTransactions(accountNumber:string):Observable<Transaction[]>{
    return this.http.get<Transaction[]>(this.apiUrl+'transactions/'+accountNumber);
  }

  updateUser(user: UserDto): Observable<BankResponse> {
    return this.http.patch<BankResponse>(this.apiUrl + 'update', user);
  }

  deleteTransaction(transactionId:string):Observable<BankResponse>{
    return this.http.delete<BankResponse>(this.apiUrl+'transactions/'+transactionId);
  }
}
