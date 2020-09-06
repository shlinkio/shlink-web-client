import moment from 'moment';
import { formatDate, formatIsoDate } from '../../../src/utils/helpers/date';

describe('date', () => {
  describe('formatDate', () => {
    it.each([
      [ moment('2020-03-05 10:00:10'), 'DD/MM/YYYY', '05/03/2020' ],
      [ moment('2020-03-05 10:00:10'), 'YYYY-MM', '2020-03' ],
      [ moment('2020-03-05 10:00:10'), undefined, '2020-03-05' ],
      [ '2020-03-05 10:00:10', 'DD-MM-YYYY', '2020-03-05 10:00:10' ],
      [ '2020-03-05 10:00:10', undefined, '2020-03-05 10:00:10' ],
      [ undefined, undefined, undefined ],
      [ null, undefined, null ],
    ])('formats date as expected', (date, format, expected) => {
      expect(formatDate(format)(date)).toEqual(expected);
    });
  });

  describe('formatIsoDate', () => {
    it.each([
      [ moment('2020-03-05 10:00:10'), moment('2020-03-05 10:00:10').format() ],
      [ '2020-03-05 10:00:10', '2020-03-05 10:00:10' ],
      [ 'foo', 'foo' ],
      [ undefined, undefined ],
      [ null, null ],
    ])('formats date as expected', (date, expected) => {
      expect(formatIsoDate(date)).toEqual(expected);
    });
  });
});
