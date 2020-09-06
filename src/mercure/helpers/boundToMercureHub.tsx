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
  return (props: MercureBoundProps & T) => {
    const { createNewVisit, loadMercureInfo, mercureInfo } = props;

    useEffect(
      bindToMercureTopic(mercureInfo, getTopicForProps(props), createNewVisit, loadMercureInfo),
      [ mercureInfo ],
    );

    return <WrappedComponent {...props} />;
  };
}
