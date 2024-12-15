import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BankStatement } from '../model/bank-statement';
import { BankResponse } from '../model/bank-response';
import { BankStatementDto } from '../model/bank-statement-dto';

@Injectable({
  providedIn: 'root'
})
export class BankstatementService {

  private apiUrl = 'http://localhost:8080/bankStatement/';

  constructor(private http: HttpClient) {}

  getStatementsByAccountNumber(accountNumber:string):Observable<BankStatement[]>{
    return this.http.get<BankStatement[]>(this.apiUrl+accountNumber);
  }

  generateStatement(bankStatementDto:BankStatementDto):Observable<BankResponse>{
    return this.http.post<BankResponse>(this.apiUrl+"generate",bankStatementDto);
  }

  downloadStatement(accountNumber:string,id:number):Observable<Blob>{
    return this.http.get<Blob>(this.apiUrl+"download/"+accountNumber+"/"+id,{ responseType: 'blob' as 'json' });
  }

  deleteStatement(accountNumber:string,id:number):Observable<BankResponse>{
    return this.http.delete<BankResponse>(this.apiUrl+accountNumber+"/"+id);
  }

}
