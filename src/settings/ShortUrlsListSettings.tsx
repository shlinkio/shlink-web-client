import type { FC } from 'react';
import { LabeledFormGroup, OrderingDropdown, SimpleCard } from '../../shlink-frontend-kit/src';
import type { Settings } from '../../shlink-web-component/src';
import { SHORT_URLS_ORDERABLE_FIELDS } from '../../shlink-web-component/src/short-urls/data';
import type { Defined } from '../utils/types';
import { DEFAULT_SHORT_URLS_ORDERING } from './reducers/settings';

type ShortUrlsSettings = Defined<Settings['shortUrlsList']>;

interface ShortUrlsListSettingsProps {
  settings: Settings;
  setShortUrlsListSettings: (settings: ShortUrlsSettings) => void;
}

export const ShortUrlsListSettings: FC<ShortUrlsListSettingsProps> = (
  { settings: { shortUrlsList }, setShortUrlsListSettings },
) => (
  <SimpleCard title="Short URLs list" className="h-100">
    <LabeledFormGroup noMargin label="Default ordering for short URLs list:">
      <OrderingDropdown
        items={SHORT_URLS_ORDERABLE_FIELDS}
        order={shortUrlsList?.defaultOrdering ?? DEFAULT_SHORT_URLS_ORDERING}
        onChange={(field, dir) => setShortUrlsListSettings({ defaultOrdering: { field, dir } })}
      />
    </LabeledFormGroup>
  </SimpleCard>
);
