import { Component } from '@angular/core';
import { DataTable , exportCSV} from 'simple-datatables';

interface CustomOptions {
  download?: boolean;
  filename?: string;
  lineDelimiter?: string;
  columnDelimiter?: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {

  

}
