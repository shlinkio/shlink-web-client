import type { IContainer } from 'bottlejs';
import Bottle from 'bottlejs';
import { pick } from 'ramda';
import { connect as reduxConnect } from 'react-redux/es/exports';
import { HttpClient } from '../../src/common/services/HttpClient';
import { ImageDownloader } from '../../src/common/services/ImageDownloader';
import { ReportExporter } from '../../src/common/services/ReportExporter';
import { csvToJson, jsonToCsv } from '../../src/utils/helpers/csvjson';
import { useTimeoutToggle } from '../../src/utils/helpers/hooks';
import { ColorGenerator } from '../../src/utils/services/ColorGenerator';
import { LocalStorage } from '../../src/utils/services/LocalStorage';
import { provideServices as provideDomainsServices } from '../domains/services/provideServices';
import { provideServices as provideMercureServices } from '../mercure/services/provideServices';
import { provideServices as provideOverviewServices } from '../overview/services/provideServices';
import { provideServices as provideShortUrlsServices } from '../short-urls/services/provideServices';
import { provideServices as provideTagsServices } from '../tags/services/provideServices';
import { provideServices as provideVisitsServices } from '../visits/services/provideServices';
import { provideServices as provideWebComponentServices } from './provideServices';

type LazyActionMap = Record<string, Function>;

export type ConnectDecorator = (props: string[] | null, actions?: string[]) => any;

export const bottle = new Bottle();

export const { container } = bottle;

const lazyService = <T extends Function, K>(cont: IContainer, serviceName: string) =>
  (...args: any[]) => (cont[serviceName] as T)(...args) as K;
const mapActionService = (map: LazyActionMap, actionName: string): LazyActionMap => ({
  ...map,
  // Wrap actual action service in a function so that it is lazily created the first time it is called
  [actionName]: lazyService(container, actionName),
});
const connect: ConnectDecorator = (propsFromState: string[] | null, actionServiceNames: string[] = []) =>
  reduxConnect(
    propsFromState ? pick(propsFromState) : null,
    actionServiceNames.reduce(mapActionService, {}),
  );

provideWebComponentServices(bottle, connect);
provideShortUrlsServices(bottle, connect);
provideTagsServices(bottle, connect);
provideVisitsServices(bottle, connect);
provideMercureServices(bottle);
provideDomainsServices(bottle, connect);
provideOverviewServices(bottle, connect);

// TODO Check which of these can be moved to shlink-web-component, and which are needed by the app too
bottle.constant('window', window);
bottle.constant('console', console);
bottle.constant('fetch', window.fetch.bind(window));

bottle.service('HttpClient', HttpClient, 'fetch');
bottle.service('ImageDownloader', ImageDownloader, 'HttpClient', 'window');
bottle.service('ReportExporter', ReportExporter, 'window', 'jsonToCsv');

bottle.constant('localStorage', window.localStorage);
bottle.service('Storage', LocalStorage, 'localStorage');
bottle.service('ColorGenerator', ColorGenerator, 'Storage');

bottle.constant('csvToJson', csvToJson);
bottle.constant('jsonToCsv', jsonToCsv);

bottle.constant('setTimeout', window.setTimeout);
bottle.constant('clearTimeout', window.clearTimeout);
bottle.serviceFactory('useTimeoutToggle', useTimeoutToggle, 'setTimeout', 'clearTimeout');
