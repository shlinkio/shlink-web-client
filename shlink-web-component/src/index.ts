import { bottle } from './container';
import { createShlinkWebComponent } from './ShlinkWebComponent';

export const ShlinkWebComponent = createShlinkWebComponent(bottle);

export type ShlinkWebComponentType = typeof ShlinkWebComponent;

export type {
  RealTimeUpdatesSettings,
  ShortUrlCreationSettings,
  ShortUrlsListSettings,
  UiSettings,
  VisitsSettings,
  TagsSettings,
  Settings,
} from './utils/settings';

export type { TagColorsStorage } from './utils/services/TagColorsStorage';
