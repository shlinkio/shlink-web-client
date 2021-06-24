import { formatISO, parse } from 'date-fns';
import { formatDate, formatIsoDate } from '../../../src/utils/helpers/date';

describe('date', () => {
  describe('formatDate', () => {
    it.each([
      [ parse('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss', new Date()), 'dd/MM/yyyy', '05/03/2020' ],
      [ parse('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss', new Date()), 'yyyy-MM', '2020-03' ],
      [ parse('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss', new Date()), undefined, '2020-03-05' ],
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
        parse('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss', new Date()),
        formatISO(parse('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss', new Date())),
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
