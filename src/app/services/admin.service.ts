import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { BankResponse } from '../model/bank-response';
import { Statistics } from '../model/statistics';
import { CardRequest } from '../model/card-request';
import { Cards } from '../model/cards';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8080/api/admin/';

  private data$!: Observable<Statistics>;

  constructor(private http: HttpClient) {}

  getStatistics():Observable<Statistics>{
    this.data$ =  this.http.get<Statistics>(this.apiUrl+'statistics').pipe(shareReplay(1));

    return this.data$;
  }

  cardAction(cardRequest:CardRequest,action:String):Observable<BankResponse>{
    return this.http.post<BankResponse>(this.apiUrl+"card/action/"+action,cardRequest);
  }

  getAllCards():Observable<Cards[]>{
    return this.http.get<Cards[]>(this.apiUrl+"fetchAllCards");
  }

  getAllAccounts():Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl+"fetchAllAccount");
  }

}