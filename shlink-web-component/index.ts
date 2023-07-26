import { bottle } from './container';
import { createShlinkWebComponent } from './ShlinkWebComponent';

export const ShlinkWebComponent = createShlinkWebComponent(bottle);

export type { Settings } from './utils/settings';
