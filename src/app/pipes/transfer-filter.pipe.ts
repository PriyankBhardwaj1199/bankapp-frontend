import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transferFilter',
  standalone: true
})
export class TransferFilterPipe implements PipeTransform {

  transform(items: any[], condition: (item: any) => boolean): any[] {
    if (!items || !condition) {
      return items;
    }
    return items.filter(condition);
  }
}
