import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cards } from '../model/cards';
import { CardRequest } from '../model/card-request';
import { BankResponse } from '../model/bank-response';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private apiUrl = 'http://localhost:8080/api/cards/';

  constructor(private http: HttpClient) {}

  getCardsByAccountNumber(accountNumber:string):Observable<Cards[]>{
    return this.http.get<Cards[]>(this.apiUrl + "get-cards/" + accountNumber);
  }
  applyCard(cardRequest:CardRequest):Observable<BankResponse>{
    return this.http.post<BankResponse>(this.apiUrl + "apply",cardRequest);
  }
  generatePin(cardRequest:CardRequest):Observable<BankResponse>{
    return this.http.post<BankResponse>(this.apiUrl + "generate-pin",cardRequest);
  }
  blockCard(cardRequest:CardRequest):Observable<BankResponse>{
    return this.http.post<BankResponse>(this.apiUrl + "block",cardRequest);
  }
  unBlockCard(cardRequest:CardRequest):Observable<BankResponse>{
    return this.http.post<BankResponse>(this.apiUrl + "unblock",cardRequest);
  }
  revokeCard(cardRequest:CardRequest):Observable<BankResponse>{
    return this.http.post<BankResponse>(this.apiUrl + "revoke",cardRequest);
  }

}
