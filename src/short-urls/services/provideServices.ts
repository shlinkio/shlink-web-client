import Bottle from 'bottlejs';
import ShortUrlsFilteringBar from '../ShortUrlsFilteringBar';
import ShortUrlsList from '../ShortUrlsList';
import ShortUrlsRow from '../helpers/ShortUrlsRow';
import ShortUrlsRowMenu from '../helpers/ShortUrlsRowMenu';
import CreateShortUrl from '../CreateShortUrl';
import DeleteShortUrlModal from '../helpers/DeleteShortUrlModal';
import CreateShortUrlResult from '../helpers/CreateShortUrlResult';
import { listShortUrls } from '../reducers/shortUrlsList';
import { createShortUrl, resetCreateShortUrl } from '../reducers/shortUrlCreation';
import { deleteShortUrl, resetDeleteShortUrl } from '../reducers/shortUrlDeletion';
import { editShortUrl } from '../reducers/shortUrlEdition';
import { ConnectDecorator } from '../../container/types';
import { ShortUrlsTable } from '../ShortUrlsTable';
import QrCodeModal from '../helpers/QrCodeModal';
import { ShortUrlForm } from '../ShortUrlForm';
import { EditShortUrl } from '../EditShortUrl';
import { getShortUrlDetail } from '../reducers/shortUrlDetail';
import { ExportShortUrlsBtn } from '../helpers/ExportShortUrlsBtn';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('ShortUrlsList', ShortUrlsList, 'ShortUrlsTable', 'ShortUrlsFilteringBar');
  bottle.decorator('ShortUrlsList', connect(
    ['selectedServer', 'mercureInfo', 'shortUrlsList', 'settings'],
    ['listShortUrls', 'createNewVisits', 'loadMercureInfo'],
  ));

  bottle.serviceFactory('ShortUrlsTable', ShortUrlsTable, 'ShortUrlsRow');
  bottle.serviceFactory('ShortUrlsRow', ShortUrlsRow, 'ShortUrlsRowMenu', 'ColorGenerator', 'useStateFlagTimeout');
  bottle.serviceFactory('ShortUrlsRowMenu', ShortUrlsRowMenu, 'DeleteShortUrlModal', 'QrCodeModal');
  bottle.serviceFactory('CreateShortUrlResult', CreateShortUrlResult, 'useStateFlagTimeout');
  bottle.serviceFactory('ShortUrlForm', ShortUrlForm, 'TagsSelector', 'DomainSelector');

  bottle.serviceFactory('CreateShortUrl', CreateShortUrl, 'ShortUrlForm', 'CreateShortUrlResult');
  bottle.decorator(
    'CreateShortUrl',
    connect(['shortUrlCreationResult', 'selectedServer', 'settings'], ['createShortUrl', 'resetCreateShortUrl']),
  );

  bottle.serviceFactory('EditShortUrl', EditShortUrl, 'ShortUrlForm');
  bottle.decorator('EditShortUrl', connect(
    ['shortUrlDetail', 'shortUrlEdition', 'selectedServer', 'settings'],
    ['getShortUrlDetail', 'editShortUrl'],
  ));

  bottle.serviceFactory('DeleteShortUrlModal', () => DeleteShortUrlModal);
  bottle.decorator('DeleteShortUrlModal', connect(['shortUrlDeletion'], ['deleteShortUrl', 'resetDeleteShortUrl']));

  bottle.serviceFactory('QrCodeModal', QrCodeModal, 'ImageDownloader', 'ForServerVersion');
  bottle.decorator('QrCodeModal', connect(['selectedServer']));

  bottle.serviceFactory('ShortUrlsFilteringBar', ShortUrlsFilteringBar, 'ColorGenerator', 'ExportShortUrlsBtn');

  bottle.serviceFactory('ExportShortUrlsBtn', ExportShortUrlsBtn, 'buildShlinkApiClient', 'ReportExporter');
  bottle.decorator('ExportShortUrlsBtn', connect(['selectedServer']));

  // Actions
  bottle.serviceFactory('listShortUrls', listShortUrls, 'buildShlinkApiClient');

  bottle.serviceFactory('createShortUrl', createShortUrl, 'buildShlinkApiClient');
  bottle.serviceFactory('resetCreateShortUrl', () => resetCreateShortUrl);

  bottle.serviceFactory('deleteShortUrl', deleteShortUrl, 'buildShlinkApiClient');
  bottle.serviceFactory('resetDeleteShortUrl', () => resetDeleteShortUrl);

  bottle.serviceFactory('getShortUrlDetail', getShortUrlDetail, 'buildShlinkApiClient');

  bottle.serviceFactory('editShortUrl', editShortUrl, 'buildShlinkApiClient');
};

export default provideServices;
