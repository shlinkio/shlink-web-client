import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router';
import { MercureBoundProps, useMercureTopicBinding } from '../mercure/helpers';
import ColorGenerator from '../utils/services/ColorGenerator';
import { TagVisits as TagVisitsState } from './reducers/tagVisits';
import TagVisitsHeader from './TagVisitsHeader';

export interface TagVisitsProps extends RouteComponentProps<{ tag: string }>, MercureBoundProps {
  getTagVisits: (tag: string, query: any) => void;
  tagVisits: TagVisitsState;
  cancelGetTagVisits: Function;
}

const TagVisits = (VisitsStats: FC<any>, colorGenerator: ColorGenerator) => ({ // TODO Use VisitsStatsProps once available
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
  const loadVisits = (dates: any) => getTagVisits(tag, dates);

  useMercureTopicBinding(mercureInfo, 'https://shlink.io/new-visit', createNewVisit, loadMercureInfo);

  return (
    <VisitsStats getVisits={loadVisits} cancelGetVisits={cancelGetTagVisits} visitsInfo={tagVisits}>
      <TagVisitsHeader tagVisits={tagVisits} goBack={goBack} colorGenerator={colorGenerator} />
    </VisitsStats>
  );
};

export default TagVisits;
