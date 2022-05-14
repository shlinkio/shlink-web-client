import { FC, useEffect } from 'react';
import { pipe } from 'ramda';
import { useParams } from 'react-router-dom';
import { CreateVisit } from '../../visits/types';
import { MercureInfo } from '../reducers/mercureInfo';
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

      return pipe(() => clearInterval(timer), () => closeEventSource?.());
    }, [mercureInfo]);

    return <WrappedComponent {...props} />;
  };
}
