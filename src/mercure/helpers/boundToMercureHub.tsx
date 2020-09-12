import React, { FC, useEffect } from 'react';
import { CreateVisit } from '../../visits/types';
import { MercureInfo } from '../reducers/mercureInfo';
import { bindToMercureTopic } from './index';

export interface MercureBoundProps {
  createNewVisit: (visitData: CreateVisit) => void;
  loadMercureInfo: Function;
  mercureInfo: MercureInfo;
}

export function boundToMercureHub<T = {}>(
  WrappedComponent: FC<MercureBoundProps & T>,
  getTopicForProps: (props: T) => string,
) {
  const pendingUpdates = new Set<CreateVisit>();

  return (props: MercureBoundProps & T) => {
    const { createNewVisit, loadMercureInfo, mercureInfo } = props;
    const { interval } = mercureInfo;

    useEffect(() => {
      const onMessage = (visit: CreateVisit) => interval ? pendingUpdates.add(visit) : createNewVisit(visit);

      interval && setInterval(() => {
        pendingUpdates.forEach(createNewVisit);
        pendingUpdates.clear();
      }, interval * 1000 * 60);

      bindToMercureTopic(mercureInfo, getTopicForProps(props), onMessage, loadMercureInfo);
    }, [ mercureInfo ]);

    return <WrappedComponent {...props} />;
  };
}
