import Bottle, { IContainer } from 'bottlejs';
import { connect as reduxConnect } from 'react-redux';
import { pick } from 'ramda';
import provideApiServices from '../api/services/provideServices';
import provideCommonServices from '../common/services/provideServices';
import provideShortUrlsServices from '../short-urls/services/provideServices';
import provideServersServices from '../servers/services/provideServices';
import provideVisitsServices from '../visits/services/provideServices';
import provideTagsServices from '../tags/services/provideServices';
import provideUtilsServices from '../utils/services/provideServices';
import provideMercureServices from '../mercure/services/provideServices';
import provideSettingsServices from '../settings/services/provideServices';
import provideDomainsServices from '../domains/services/provideServices';
import provideAppServices from '../app/services/provideServices';
import { ConnectDecorator } from './types';

type LazyActionMap = Record<string, Function>;

const bottle = new Bottle();

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

provideAppServices(bottle, connect);
provideCommonServices(bottle, connect);
provideApiServices(bottle);
provideShortUrlsServices(bottle, connect);
provideServersServices(bottle, connect);
provideTagsServices(bottle, connect);
provideVisitsServices(bottle, connect);
provideUtilsServices(bottle);
provideMercureServices(bottle);
provideSettingsServices(bottle, connect);
provideDomainsServices(bottle, connect);
