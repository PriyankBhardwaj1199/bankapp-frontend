import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cards } from '../model/cards';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private apiUrl = 'http://localhost:8080/api/cards/';

  constructor(private http: HttpClient) {}

  getCardsByAccountNumber(accountNumber:string):Observable<Cards[]>{
    return this.http.get<Cards[]>(this.apiUrl + "get-cards/" + accountNumber);
  }

}
