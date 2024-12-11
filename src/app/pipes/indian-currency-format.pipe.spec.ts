import { IndianCurrencyFormatPipe } from './indian-currency-format.pipe';

describe('IndianCurrencyFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new IndianCurrencyFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
