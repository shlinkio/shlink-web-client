import * as sinon from 'sinon';
import L from 'leaflet';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {
  stateFlagTimeout as stateFlagTimeoutFactory,
  determineOrderDir,
  fixLeafletIcons,
  rangeOf,
} from '../../src/utils/utils';

describe('utils', () => {
  describe('stateFlagTimeout', () => {
    it('sets state and initializes timeout with provided delay', () => {
      const setTimeout = sinon.fake((callback) => callback());
      const setState = sinon.spy();
      const stateFlagTimeout = stateFlagTimeoutFactory(setTimeout);
      const delay = 5000;
      const expectedSetStateCalls = 2;

      stateFlagTimeout(setState, 'foo', false, delay);

      expect(setState.callCount).toEqual(expectedSetStateCalls);
      expect(setState.getCall(0).args).toEqual([{ foo: false }]);
      expect(setState.getCall(1).args).toEqual([{ foo: true }]);
      expect(setTimeout.callCount).toEqual(1);
      expect(setTimeout.getCall(0).args[1]).toEqual(delay);
    });
  });

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

  describe('fixLeafletIcons', () => {
    it('updates icons used by leaflet', () => {
      fixLeafletIcons();

      const { iconRetinaUrl, iconUrl, shadowUrl } = L.Icon.Default.prototype.options;

      expect(iconRetinaUrl).toEqual(marker2x);
      expect(iconUrl).toEqual(marker);
      expect(shadowUrl).toEqual(markerShadow);
    });
  });

  describe('rangeOf', () => {
    const func = (i) => `result_${i}`;
    const size = 5;

    it('builds a range of specified size invike provided function', () => {
      expect(rangeOf(size, func)).toEqual([
        'result_1',
        'result_2',
        'result_3',
        'result_4',
        'result_5',
      ]);
    });

    it('builds a range starting at provided pos', () => {
      const startAt = 3;

      expect(rangeOf(size, func, startAt)).toEqual([
        'result_3',
        'result_4',
        'result_5',
      ]);
    });
  });
});
