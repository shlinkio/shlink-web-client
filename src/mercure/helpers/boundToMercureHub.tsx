import type { FC } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createPipe } from 'remeda';
import type { CreateVisit } from '../../visits/types';
import type { MercureInfo } from '../reducers/mercureInfo';
import { bindToMercureTopic } from './index';

export interface MercureBoundProps {
  createNewVisits: (createdVisits: CreateVisit[]) => void;
  loadMercureInfo: () => void;
  mercureInfo: MercureInfo;
}

export function boundToMercureHub<T = {}>(
  WrappedComponent: FC<MercureBoundProps & T>,
  getTopicsForProps: (props: T, routeParams: any) => string[],
) {
  const pendingUpdates = new Set<CreateVisit>();

  return (props: MercureBoundProps & T) => {
    const { createNewVisits, loadMercureInfo, mercureInfo } = props;
    const { interval } = mercureInfo;
    const params = useParams();

    useEffect(() => {
      const onMessage = (visit: CreateVisit) => (interval ? pendingUpdates.add(visit) : createNewVisits([visit]));
      const topics = getTopicsForProps(props, params);
      const closeEventSource = bindToMercureTopic(mercureInfo, topics, onMessage, loadMercureInfo);

      if (!interval) {
        return closeEventSource;
      }

      const timer = setInterval(() => {
        createNewVisits([...pendingUpdates]);
        pendingUpdates.clear();
      }, interval * 1000 * 60);

      return () => createPipe(() => clearInterval(timer), () => closeEventSource?.())(undefined);
    }, [mercureInfo]);

    return <WrappedComponent {...props} />;
  };
}
