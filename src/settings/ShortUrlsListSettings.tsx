import { LabeledFormGroup, OrderingDropdown, SimpleCard } from '@shlinkio/shlink-frontend-kit';
import type { Settings, ShortUrlsListSettings as ShortUrlsSettings } from '@shlinkio/shlink-web-component';
import type { FC } from 'react';
import { SHORT_URLS_ORDERABLE_FIELDS } from '../../shlink-web-component/src/short-urls/data';
import { DEFAULT_SHORT_URLS_ORDERING } from './reducers/settings';

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
