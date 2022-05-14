import { EventSourcePolyfill } from 'event-source-polyfill';
import { Mock } from 'ts-mockery';
import { identity } from 'ramda';
import { bindToMercureTopic } from '../../../src/mercure/helpers';
import { MercureInfo } from '../../../src/mercure/reducers/mercureInfo';

jest.mock('event-source-polyfill');

describe('helpers', () => {
  afterEach(jest.resetAllMocks);

  describe('bindToMercureTopic', () => {
    const onMessage = jest.fn();
    const onTokenExpired = jest.fn();

    it.each([
      [Mock.of<MercureInfo>({ loading: true, error: false, mercureHubUrl: 'foo' })],
      [Mock.of<MercureInfo>({ loading: false, error: true, mercureHubUrl: 'foo' })],
      [Mock.of<MercureInfo>({ loading: true, error: true, mercureHubUrl: 'foo' })],
      [Mock.of<MercureInfo>({ loading: false, error: false, mercureHubUrl: undefined })],
      [Mock.of<MercureInfo>({ loading: true, error: true, mercureHubUrl: undefined })],
    ])('does not bind an EventSource when loading, error or no hub URL', (mercureInfo) => {
      bindToMercureTopic(mercureInfo, [''], identity, () => {});

      expect(EventSourcePolyfill).not.toHaveBeenCalled();
      expect(onMessage).not.toHaveBeenCalled();
      expect(onTokenExpired).not.toHaveBeenCalled();
    });

    it('binds an EventSource when mercure info is properly loaded', () => {
      const token = 'abc.123.efg';
      const mercureHubUrl = 'https://example.com/.well-known/mercure';
      const topic = 'foo';
      const hubUrl = new URL(mercureHubUrl);

      hubUrl.searchParams.append('topic', topic);

      const callback = bindToMercureTopic({
        loading: false,
        error: false,
        mercureHubUrl,
        token,
      }, [topic], onMessage, onTokenExpired);

      expect(EventSourcePolyfill).toHaveBeenCalledWith(hubUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const [es] = (EventSourcePolyfill as any).mock.instances as EventSourcePolyfill[];

      es.onmessage?.({ data: '{"foo": "bar"}' });
      es.onerror?.({ status: 401 });
      expect(onMessage).toHaveBeenCalledWith({ foo: 'bar' });
      expect(onTokenExpired).toHaveBeenCalled();

      callback?.();
      expect(es.close).toHaveBeenCalled();
    });
  });
});
