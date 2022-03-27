import { Action } from 'redux';
import { buildActionCreator, buildReducer } from '../../../src/utils/helpers/redux';

describe('redux', () => {
  beforeEach(jest.clearAllMocks);

  describe('buildActionCreator', () => {
    it.each([
      ['foo', { type: 'foo' }],
      ['bar', { type: 'bar' }],
      ['something', { type: 'something' }],
    ])('returns an action creator', (type, expected) => {
      const actionCreator = buildActionCreator(type);

      expect(actionCreator).toBeInstanceOf(Function);
      expect(actionCreator()).toEqual(expected);
    });
  });

  describe('buildReducer', () => {
    const fooActionHandler = jest.fn(() => 'foo result');
    const barActionHandler = jest.fn(() => 'bar result');
    const initialState = 'initial state';
    let reducer: Function;

    beforeEach(() => {
      reducer = buildReducer<string, Action>({
        foo: fooActionHandler,
        bar: barActionHandler,
      }, initialState);
    });

    it('returns a reducer which returns initial state when provided with unknown action', () => {
      expect(reducer(undefined, { type: 'unknown action' })).toEqual(initialState);
      expect(fooActionHandler).not.toHaveBeenCalled();
      expect(barActionHandler).not.toHaveBeenCalled();
    });

    it.each([
      ['foo', 'foo result', fooActionHandler, barActionHandler],
      ['bar', 'bar result', barActionHandler, fooActionHandler],
    ])(
      'returns a reducer which calls corresponding action handler',
      (type, expected, invokedActionHandler, notInvokedActionHandler) => {
        expect(reducer(undefined, { type })).toEqual(expected);
        expect(invokedActionHandler).toHaveBeenCalled();
        expect(notInvokedActionHandler).not.toHaveBeenCalled();
      },
    );

    it.each([
      [undefined, initialState],
      ['foo', 'foo'],
      ['something', 'something'],
    ])('returns a reducer which calls action handler with provided state or initial', (state, expected) => {
      reducer(state, { type: 'foo' });

      expect(fooActionHandler).toHaveBeenCalledWith(expected, expect.anything());
    });
  });
});
