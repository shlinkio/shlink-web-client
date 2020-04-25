import { EventSourcePolyfill as EventSource } from 'event-source-polyfill';

export const bindToMercureTopic = (mercureInfo, realTimeUpdates, topic, onMessage, onTokenExpired) => () => {
  const { enabled } = realTimeUpdates;
  const { mercureHubUrl, token, loading, error } = mercureInfo;

  if (!enabled || loading || error) {
    return undefined;
  }

  const hubUrl = new URL(mercureHubUrl);

  hubUrl.searchParams.append('topic', topic);
  const es = new EventSource(hubUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  es.onmessage = ({ data }) => onMessage(JSON.parse(data));
  es.onerror = ({ status }) => status === 401 && onTokenExpired();

  return () => es.close();
};
