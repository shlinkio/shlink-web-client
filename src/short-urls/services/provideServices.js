import { connect as reduxConnect } from 'react-redux';
import { assoc } from 'ramda';
import ShortUrls from '../ShortUrls';
import SearchBar from '../SearchBar';
import ShortUrlsList from '../ShortUrlsList';
import ShortUrlsRow from '../helpers/ShortUrlsRow';
import ShortUrlsRowMenu from '../helpers/ShortUrlsRowMenu';
import CreateShortUrl from '../CreateShortUrl';
import DeleteShortUrlModal from '../helpers/DeleteShortUrlModal';
import EditTagsModal from '../helpers/EditTagsModal';
import EditMetaModal from '../helpers/EditMetaModal';
import CreateShortUrlResult from '../helpers/CreateShortUrlResult';
import { listShortUrls } from '../reducers/shortUrlsList';
import { createShortUrl, resetCreateShortUrl } from '../reducers/shortUrlCreation';
import { deleteShortUrl, resetDeleteShortUrl } from '../reducers/shortUrlDeletion';
import { editShortUrlTags, resetShortUrlsTags } from '../reducers/shortUrlTags';
import { editShortUrlMeta, resetShortUrlMeta } from '../reducers/shortUrlMeta';
import { resetShortUrlParams } from '../reducers/shortUrlsListParams';

const provideServices = (bottle, connect) => {
  // Components
  bottle.serviceFactory('ShortUrls', ShortUrls, 'SearchBar', 'ShortUrlsList');
  bottle.decorator('ShortUrls', reduxConnect(
    (state) => assoc('shortUrlsList', state.shortUrlsList.shortUrls, state.shortUrlsList)
  ));

  bottle.serviceFactory('SearchBar', SearchBar, 'ColorGenerator', 'ForServerVersion');
  bottle.decorator('SearchBar', connect([ 'shortUrlsListParams' ], [ 'listShortUrls' ]));

  bottle.serviceFactory('ShortUrlsList', ShortUrlsList, 'ShortUrlsRow');
  bottle.decorator('ShortUrlsList', connect(
    [ 'selectedServer', 'shortUrlsListParams' ],
    [ 'listShortUrls', 'resetShortUrlParams' ]
  ));

  bottle.serviceFactory('ShortUrlsRow', ShortUrlsRow, 'ShortUrlsRowMenu', 'ColorGenerator', 'stateFlagTimeout');

  bottle.serviceFactory(
    'ShortUrlsRowMenu',
    ShortUrlsRowMenu,
    'DeleteShortUrlModal',
    'EditTagsModal',
    'EditMetaModal',
    'ForServerVersion'
  );
  bottle.serviceFactory('CreateShortUrlResult', CreateShortUrlResult, 'stateFlagTimeout');

  bottle.serviceFactory('CreateShortUrl', CreateShortUrl, 'TagsSelector', 'CreateShortUrlResult', 'ForServerVersion');
  bottle.decorator(
    'CreateShortUrl',
    connect([ 'shortUrlCreationResult', 'selectedServer' ], [ 'createShortUrl', 'resetCreateShortUrl' ])
  );

  bottle.serviceFactory('DeleteShortUrlModal', () => DeleteShortUrlModal);
  bottle.decorator('DeleteShortUrlModal', connect([ 'shortUrlDeletion' ], [ 'deleteShortUrl', 'resetDeleteShortUrl' ]));

  bottle.serviceFactory('EditTagsModal', EditTagsModal, 'TagsSelector');
  bottle.decorator('EditTagsModal', connect([ 'shortUrlTags' ], [ 'editShortUrlTags', 'resetShortUrlsTags' ]));

  bottle.serviceFactory('EditMetaModal', () => EditMetaModal);
  bottle.decorator('EditMetaModal', connect([ 'shortUrlMeta' ], [ 'editShortUrlMeta', 'resetShortUrlMeta' ]));

  // Actions
  bottle.serviceFactory('editShortUrlTags', editShortUrlTags, 'buildShlinkApiClient');
  bottle.serviceFactory('resetShortUrlsTags', () => resetShortUrlsTags);

  bottle.serviceFactory('listShortUrls', listShortUrls, 'buildShlinkApiClient');
  bottle.serviceFactory('resetShortUrlParams', () => resetShortUrlParams);

  bottle.serviceFactory('createShortUrl', createShortUrl, 'buildShlinkApiClient');
  bottle.serviceFactory('resetCreateShortUrl', () => resetCreateShortUrl);

  bottle.serviceFactory('deleteShortUrl', deleteShortUrl, 'buildShlinkApiClient');
  bottle.serviceFactory('resetDeleteShortUrl', () => resetDeleteShortUrl);

  bottle.serviceFactory('editShortUrlMeta', editShortUrlMeta, 'buildShlinkApiClient');
  bottle.serviceFactory('resetShortUrlMeta', () => resetShortUrlMeta);
};

export default provideServices;
