import { determineOrderDir, OrderDir, orderToString, stringToOrder } from '../../../src/utils/helpers/ordering';

describe('ordering', () => {
  describe('determineOrderDir', () => {
    it('returns ASC when current order field and selected field are different', () => {
      expect(determineOrderDir('foo', 'bar')).toEqual('ASC');
      expect(determineOrderDir('bar', 'foo')).toEqual('ASC');
    });

    it('returns ASC when no current order dir is provided', () => {
      expect(determineOrderDir('foo', 'foo')).toEqual('ASC');
      expect(determineOrderDir('bar', 'bar')).toEqual('ASC');
    });

    it('returns DESC when current order field and selected field are equal and current order dir is ASC', () => {
      expect(determineOrderDir('foo', 'foo', 'ASC')).toEqual('DESC');
      expect(determineOrderDir('bar', 'bar', 'ASC')).toEqual('DESC');
    });

    it('returns undefined when current order field and selected field are equal and current order dir is DESC', () => {
      expect(determineOrderDir('foo', 'foo', 'DESC')).toBeUndefined();
      expect(determineOrderDir('bar', 'bar', 'DESC')).toBeUndefined();
    });
  });

  describe('orderToString', () => {
    it.each([
      [{}, undefined],
      [{ field: 'foo' }, undefined],
      [{ field: 'foo', dir: 'ASC' as OrderDir }, 'foo-ASC'],
      [{ field: 'bar', dir: 'DESC' as OrderDir }, 'bar-DESC'],
    ])('casts the order to string', (order, expectedResult) => {
      expect(orderToString(order)).toEqual(expectedResult);
    });
  });

  describe('stringToOrder', () => {
    it.each([
      ['foo-ASC', { field: 'foo', dir: 'ASC' }],
      ['bar-DESC', { field: 'bar', dir: 'DESC' }],
    ])('casts a string to an order objects', (order, expectedResult) => {
      expect(stringToOrder(order)).toEqual(expectedResult);
    });
  });
});
