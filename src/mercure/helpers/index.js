import { EventSourcePolyfill as EventSource } from 'event-source-polyfill';

export const bindToMercureTopic = (mercureInfo, topic, onMessage) => () => {
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

  // TODO Handle errors and get a new token
  es.onerror = () => {};

  return () => es.close();
};
