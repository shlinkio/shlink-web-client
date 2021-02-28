import { EventSourcePolyfill as EventSource } from 'event-source-polyfill';
import { MercureInfo } from '../reducers/mercureInfo';

export const bindToMercureTopic = <T>(mercureInfo: MercureInfo, topics: string[], onMessage: (message: T) => void, onTokenExpired: () => void) => { // eslint-disable-line max-len
  const { mercureHubUrl, token, loading, error } = mercureInfo;

  if (loading || error || !mercureHubUrl) {
    return undefined;
  }

  const onEventSourceMessage = ({ data }: { data: string }) => onMessage(JSON.parse(data) as T);
  const onEventSourceError = ({ status }: { status: number }) => status === 401 && onTokenExpired();

  const subscriptions = topics.map((topic) => {
    const hubUrl = new URL(mercureHubUrl);

    hubUrl.searchParams.append('topic', topic);
    const es = new EventSource(hubUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    es.onmessage = onEventSourceMessage;
    es.onerror = onEventSourceError;

    return es;
  });

  return () => subscriptions.forEach((es) => es.close());
};
