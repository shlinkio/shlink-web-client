import React from 'react';
import { RouteComponentProps } from 'react-router';
import { MercureBoundProps, useMercureTopicBinding } from '../mercure/helpers';
import ColorGenerator from '../utils/services/ColorGenerator';
import { ShlinkVisitsParams } from '../utils/services/types';
import { TagVisits as TagVisitsState } from './reducers/tagVisits';
import TagVisitsHeader from './TagVisitsHeader';
import VisitsStats from './VisitsStats';

export interface TagVisitsProps extends RouteComponentProps<{ tag: string }>, MercureBoundProps {
  getTagVisits: (tag: string, query: any) => void;
  tagVisits: TagVisitsState;
  cancelGetTagVisits: () => void;
}

const TagVisits = (colorGenerator: ColorGenerator) => ({
  history: { goBack },
  match,
  getTagVisits,
  tagVisits,
  cancelGetTagVisits,
  createNewVisit,
  loadMercureInfo,
  mercureInfo,
}: TagVisitsProps) => {
  const { params } = match;
  const { tag } = params;
  const loadVisits = (params: ShlinkVisitsParams) => getTagVisits(tag, params);

  useMercureTopicBinding(mercureInfo, 'https://shlink.io/new-visit', createNewVisit, loadMercureInfo);

  return (
    <VisitsStats getVisits={loadVisits} cancelGetVisits={cancelGetTagVisits} visitsInfo={tagVisits}>
      <TagVisitsHeader tagVisits={tagVisits} goBack={goBack} colorGenerator={colorGenerator} />
    </VisitsStats>
  );
};

export default TagVisits;
