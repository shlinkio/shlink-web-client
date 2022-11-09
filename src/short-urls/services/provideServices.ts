import Bottle from 'bottlejs';
import { prop } from 'ramda';
import { ShortUrlsFilteringBar } from '../ShortUrlsFilteringBar';
import { ShortUrlsList } from '../ShortUrlsList';
import { ShortUrlsRow } from '../helpers/ShortUrlsRow';
import { ShortUrlsRowMenu } from '../helpers/ShortUrlsRowMenu';
import { CreateShortUrl } from '../CreateShortUrl';
import { DeleteShortUrlModal } from '../helpers/DeleteShortUrlModal';
import { CreateShortUrlResult } from '../helpers/CreateShortUrlResult';
import { listShortUrls, shortUrlsListReducerCreator } from '../reducers/shortUrlsList';
import { shortUrlCreationReducerCreator, createShortUrl } from '../reducers/shortUrlCreation';
import { shortUrlDeletionReducerCreator, deleteShortUrl } from '../reducers/shortUrlDeletion';
import { editShortUrl, shortUrlEditionReducerCreator } from '../reducers/shortUrlEdition';
import { shortUrlDetailReducerCreator } from '../reducers/shortUrlDetail';
import { ConnectDecorator } from '../../container/types';
import { ShortUrlsTable } from '../ShortUrlsTable';
import { ShortUrlForm } from '../ShortUrlForm';
import { EditShortUrl } from '../EditShortUrl';
import { QrCodeModal } from '../helpers/QrCodeModal';
import { ExportShortUrlsBtn } from '../helpers/ExportShortUrlsBtn';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('ShortUrlsList', ShortUrlsList, 'ShortUrlsTable', 'ShortUrlsFilteringBar');
  bottle.decorator('ShortUrlsList', connect(
    ['selectedServer', 'mercureInfo', 'shortUrlsList', 'settings'],
    ['listShortUrls', 'createNewVisits', 'loadMercureInfo'],
  ));

  bottle.serviceFactory('ShortUrlsTable', ShortUrlsTable, 'ShortUrlsRow');
  bottle.serviceFactory('ShortUrlsRow', ShortUrlsRow, 'ShortUrlsRowMenu', 'ColorGenerator', 'useTimeoutToggle');
  bottle.serviceFactory('ShortUrlsRowMenu', ShortUrlsRowMenu, 'DeleteShortUrlModal', 'QrCodeModal');
  bottle.serviceFactory('CreateShortUrlResult', CreateShortUrlResult, 'useTimeoutToggle');
  bottle.serviceFactory('ShortUrlForm', ShortUrlForm, 'TagsSelector', 'DomainSelector');

  bottle.serviceFactory('CreateShortUrl', CreateShortUrl, 'ShortUrlForm', 'CreateShortUrlResult');
  bottle.decorator(
    'CreateShortUrl',
    connect(['shortUrlCreation', 'selectedServer', 'settings'], ['createShortUrl', 'resetCreateShortUrl']),
  );

  bottle.serviceFactory('EditShortUrl', EditShortUrl, 'ShortUrlForm');
  bottle.decorator('EditShortUrl', connect(
    ['shortUrlDetail', 'shortUrlEdition', 'selectedServer', 'settings'],
    ['getShortUrlDetail', 'editShortUrl'],
  ));

  bottle.serviceFactory('DeleteShortUrlModal', () => DeleteShortUrlModal);
  bottle.decorator('DeleteShortUrlModal', connect(['shortUrlDeletion'], ['deleteShortUrl', 'resetDeleteShortUrl']));

  bottle.serviceFactory('QrCodeModal', QrCodeModal, 'ImageDownloader');
  bottle.decorator('QrCodeModal', connect(['selectedServer']));

  bottle.serviceFactory('ShortUrlsFilteringBar', ShortUrlsFilteringBar, 'ExportShortUrlsBtn', 'TagsSelector');

  bottle.serviceFactory('ExportShortUrlsBtn', ExportShortUrlsBtn, 'buildShlinkApiClient', 'ReportExporter');
  bottle.decorator('ExportShortUrlsBtn', connect(['selectedServer']));

  // Reducers
  bottle.serviceFactory(
    'shortUrlsListReducerCreator',
    shortUrlsListReducerCreator,
    'listShortUrls',
    'editShortUrl',
    'createShortUrl',
    'deleteShortUrl',
  );
  bottle.serviceFactory('shortUrlsListReducer', prop('reducer'), 'shortUrlsListReducerCreator');

  bottle.serviceFactory('shortUrlCreationReducerCreator', shortUrlCreationReducerCreator, 'createShortUrl');
  bottle.serviceFactory('shortUrlCreationReducer', prop('reducer'), 'shortUrlCreationReducerCreator');

  bottle.serviceFactory('shortUrlEditionReducerCreator', shortUrlEditionReducerCreator, 'editShortUrl');
  bottle.serviceFactory('shortUrlEditionReducer', prop('reducer'), 'shortUrlEditionReducerCreator');

  bottle.serviceFactory('shortUrlDeletionReducerCreator', shortUrlDeletionReducerCreator, 'deleteShortUrl');
  bottle.serviceFactory('shortUrlDeletionReducer', prop('reducer'), 'shortUrlDeletionReducerCreator');

  bottle.serviceFactory('shortUrlDetailReducerCreator', shortUrlDetailReducerCreator, 'buildShlinkApiClient');
  bottle.serviceFactory('shortUrlDetailReducer', prop('reducer'), 'shortUrlDetailReducerCreator');

  // Actions
  bottle.serviceFactory('listShortUrls', listShortUrls, 'buildShlinkApiClient');

  bottle.serviceFactory('createShortUrl', createShortUrl, 'buildShlinkApiClient');
  bottle.serviceFactory('resetCreateShortUrl', prop('resetCreateShortUrl'), 'shortUrlCreationReducerCreator');

  bottle.serviceFactory('deleteShortUrl', deleteShortUrl, 'buildShlinkApiClient');
  bottle.serviceFactory('resetDeleteShortUrl', prop('resetDeleteShortUrl'), 'shortUrlDeletionReducerCreator');

  bottle.serviceFactory('getShortUrlDetail', prop('getShortUrlDetail'), 'shortUrlDetailReducerCreator');

  bottle.serviceFactory('editShortUrl', editShortUrl, 'buildShlinkApiClient');
};

export default provideServices;
