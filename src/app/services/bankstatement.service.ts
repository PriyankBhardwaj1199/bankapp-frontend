import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BankStatement } from '../model/bank-statement';

@Injectable({
  providedIn: 'root'
})
export class BankstatementService {

  private apiUrl = 'http://localhost:8080/bankStatement/';

  constructor(private http: HttpClient) {}

  getStatementsByAccountNumber(accountNumber:string):Observable<BankStatement[]>{
    return this.http.get<BankStatement[]>(this.apiUrl+accountNumber);
  }

  downloadStatement(accountNumber:string,id:number):Observable<Blob>{
    return this.http.get<Blob>(this.apiUrl+"download/"+accountNumber+"/"+id,{ responseType: 'blob' as 'json' });
  }

}
