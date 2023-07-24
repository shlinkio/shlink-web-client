import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { IContainer } from 'bottlejs';

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
