import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrencyFormat',
  standalone: true
})
export class IndianCurrencyFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return ''; // Handle null, undefined, or empty input
    }

    // Convert the input to a number
    const numericValue = typeof value === 'string' ? Number(value) : value;

    if (isNaN(numericValue)) {
      return ''; // Return an empty string for invalid numbers
    }

    // Convert number to string for regex formatting
    const stringValue = numericValue.toFixed(0); // Ensure no decimals

    // Format for Indian numbering system
    let [integerPart, decimalPart] = stringValue.split('.');
    integerPart = integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); // For the last three digits
    integerPart = integerPart.replace(/(\d+?)(?=(\d{2})+(?!\d{3}))/g, "$1,"); // For two-digit groups before the thousands

    return `₹${integerPart}${decimalPart ? '.' + decimalPart : ''}`;
  }

}
