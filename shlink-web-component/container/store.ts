import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { IContainer } from 'bottlejs';
import type { DomainsList } from '../domains/reducers/domainsList';
import type { MercureInfo } from '../mercure/reducers/mercureInfo';
import type { ShortUrlCreation } from '../short-urls/reducers/shortUrlCreation';
import type { ShortUrlDeletion } from '../short-urls/reducers/shortUrlDeletion';
import type { ShortUrlDetail } from '../short-urls/reducers/shortUrlDetail';
import type { ShortUrlEdition } from '../short-urls/reducers/shortUrlEdition';
import type { ShortUrlsList } from '../short-urls/reducers/shortUrlsList';
import type { TagDeletion } from '../tags/reducers/tagDelete';
import type { TagEdition } from '../tags/reducers/tagEdit';
import type { TagsList } from '../tags/reducers/tagsList';
import type { DomainVisits } from '../visits/reducers/domainVisits';
import type { ShortUrlVisits } from '../visits/reducers/shortUrlVisits';
import type { TagVisits } from '../visits/reducers/tagVisits';
import type { VisitsInfo } from '../visits/reducers/types';
import type { VisitsOverview } from '../visits/reducers/visitsOverview';

const isProduction = process.env.NODE_ENV === 'production';

export const setUpStore = (container: IContainer) => configureStore({
  devTools: !isProduction,
  reducer: combineReducers({
    mercureInfo: container.mercureInfoReducer,
    shortUrlsList: container.shortUrlsListReducer,
    shortUrlCreation: container.shortUrlCreationReducer,
    shortUrlDeletion: container.shortUrlDeletionReducer,
    shortUrlEdition: container.shortUrlEditionReducer,
    shortUrlDetail: container.shortUrlDetailReducer,
    shortUrlVisits: container.shortUrlVisitsReducer,
    tagVisits: container.tagVisitsReducer,
    domainVisits: container.domainVisitsReducer,
    orphanVisits: container.orphanVisitsReducer,
    nonOrphanVisits: container.nonOrphanVisitsReducer,
    tagsList: container.tagsListReducer,
    tagDelete: container.tagDeleteReducer,
    tagEdit: container.tagEditReducer,
    domainsList: container.domainsListReducer,
    visitsOverview: container.visitsOverviewReducer,
  }),
  middleware: (defaultMiddlewaresIncludingReduxThunk) => defaultMiddlewaresIncludingReduxThunk({
    // State is too big for these
    immutableCheck: false,
    serializableCheck: false,
  }),
});

export type RootState = {
  shortUrlsList: ShortUrlsList;
  shortUrlCreation: ShortUrlCreation;
  shortUrlDeletion: ShortUrlDeletion;
  shortUrlEdition: ShortUrlEdition;
  shortUrlVisits: ShortUrlVisits;
  tagVisits: TagVisits;
  domainVisits: DomainVisits;
  orphanVisits: VisitsInfo;
  nonOrphanVisits: VisitsInfo;
  shortUrlDetail: ShortUrlDetail;
  tagsList: TagsList;
  tagDelete: TagDeletion;
  tagEdit: TagEdition;
  mercureInfo: MercureInfo;
  domainsList: DomainsList;
  visitsOverview: VisitsOverview;
};
