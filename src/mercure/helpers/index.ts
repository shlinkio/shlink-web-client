import { EventSourcePolyfill as EventSource } from 'event-source-polyfill';
import { MercureInfo } from '../reducers/mercureInfo';

export const bindToMercureTopic = <T>(mercureInfo: MercureInfo, topic: string, onMessage: (message: T) => void, onTokenExpired: Function) => { // eslint-disable-line max-len
  const { mercureHubUrl, token, loading, error } = mercureInfo;

  if (loading || error || !mercureHubUrl) {
    return undefined;
  }

  const hubUrl = new URL(mercureHubUrl);

  hubUrl.searchParams.append('topic', topic);
  const es = new EventSource(hubUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  es.onmessage = ({ data }: { data: string }) => onMessage(JSON.parse(data) as T);
  es.onerror = ({ status }: { status: number }) => status === 401 && onTokenExpired();

  return () => es.close();
};
