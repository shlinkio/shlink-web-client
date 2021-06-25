import { formatISO } from 'date-fns';
import { formatDate, formatIsoDate, parseDate } from '../../../src/utils/helpers/date';

describe('date', () => {
  describe('formatDate', () => {
    it.each([
      [ parseDate('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss'), 'dd/MM/yyyy', '05/03/2020' ],
      [ parseDate('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss'), 'yyyy-MM', '2020-03' ],
      [ parseDate('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss'), undefined, '2020-03-05' ],
      [ '2020-03-05 10:00:10', 'dd-MM-yyyy', '2020-03-05 10:00:10' ],
      [ '2020-03-05 10:00:10', undefined, '2020-03-05 10:00:10' ],
      [ undefined, undefined, undefined ],
      [ null, undefined, null ],
    ])('formats date as expected', (date, format, expected) => {
      expect(formatDate(format)(date)).toEqual(expected);
    });
  });

  describe('formatIsoDate', () => {
    it.each([
      [
        parseDate('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss'),
        formatISO(parseDate('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss')),
      ],
      [ '2020-03-05 10:00:10', '2020-03-05 10:00:10' ],
      [ 'foo', 'foo' ],
      [ undefined, undefined ],
      [ null, null ],
    ])('formats date as expected', (date, expected) => {
      expect(formatIsoDate(date)).toEqual(expected);
    });
  });
});
