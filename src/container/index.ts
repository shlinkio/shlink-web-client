import type { IContainer } from 'bottlejs';
import Bottle from 'bottlejs';
import { connect as reduxConnect } from 'react-redux';
import { pick } from 'remeda';
import { provideServices as provideApiServices } from '../api/services/provideServices';
import { provideServices as provideAppServices } from '../app/services/provideServices';
import { provideServices as provideCommonServices } from '../common/services/provideServices';
import { provideServices as provideDomainsServices } from '../domains/services/provideServices';
import { provideServices as provideMercureServices } from '../mercure/services/provideServices';
import { provideServices as provideServersServices } from '../servers/services/provideServices';
import { provideServices as provideSettingsServices } from '../settings/services/provideServices';
import { provideServices as provideShortUrlsServices } from '../short-urls/services/provideServices';
import { provideServices as provideTagsServices } from '../tags/services/provideServices';
import { provideServices as provideUtilsServices } from '../utils/services/provideServices';
import { provideServices as provideVisitsServices } from '../visits/services/provideServices';
import type { ConnectDecorator } from './types';

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
    propsFromState ? pick(propsFromState as any) : null,
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
