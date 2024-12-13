import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-cards',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './manage-cards.component.html',
  styleUrl: './manage-cards.component.css'
})
export class ManageCardsComponent {
  showFilterDropDown:boolean = false;

  cardStates = ['Active','Blocked','Expired','Generated','InActive','Pending','Requested','Revoked'];

  toggleShowFilterDropdown(){
    this.showFilterDropDown = !this.showFilterDropDown;
  }
}
