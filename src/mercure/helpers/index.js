import { useEffect } from 'react';
import { EventSourcePolyfill as EventSource } from 'event-source-polyfill';

export const bindToMercureTopic = (mercureInfo, topic, onMessage, onTokenExpired) => () => {
  const { mercureHubUrl, token, loading, error } = mercureInfo;

  if (loading || error) {
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

export const useMercureTopicBinding = (mercureInfo, topic, onMessage, onTokenExpired) => {
  useEffect(bindToMercureTopic(mercureInfo, topic, onMessage, onTokenExpired), [ mercureInfo ]);
};
