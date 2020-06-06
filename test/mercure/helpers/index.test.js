import { EventSourcePolyfill as EventSource } from 'event-source-polyfill';
import { bindToMercureTopic } from '../../../src/mercure/helpers';

jest.mock('event-source-polyfill');

describe('helpers', () => {
  afterEach(jest.resetAllMocks);

  describe('bindToMercureTopic', () => {
    const onMessage = jest.fn();
    const onTokenExpired = jest.fn();

    it.each([
      [{ loading: true, error: false }],
      [{ loading: false, error: true }],
      [{ loading: true, error: true }],
    ])('does not bind an EventSource when loading or error', (mercureInfo) => {
      bindToMercureTopic(mercureInfo)();

      expect(EventSource).not.toHaveBeenCalled();
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
      }, topic, onMessage, onTokenExpired)();

      expect(EventSource).toHaveBeenCalledWith(hubUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const [ es ] = EventSource.mock.instances;

      es.onmessage({ data: '{"foo": "bar"}' });
      es.onerror({ status: 401 });
      expect(onMessage).toHaveBeenCalledWith({ foo: 'bar' });
      expect(onTokenExpired).toHaveBeenCalled();

      callback();
      expect(es.close).toHaveBeenCalled();
    });
  });
});
