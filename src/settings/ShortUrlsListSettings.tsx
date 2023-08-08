import { LabeledFormGroup, OrderingDropdown, SimpleCard } from '@shlinkio/shlink-frontend-kit';
import type { Settings, ShortUrlsListSettings as ShortUrlsSettings } from '@shlinkio/shlink-web-component';
import type { FC } from 'react';
import { DEFAULT_SHORT_URLS_ORDERING } from './reducers/settings';

interface ShortUrlsListSettingsProps {
  settings: Settings;
  setShortUrlsListSettings: (settings: ShortUrlsSettings) => void;
}

const SHORT_URLS_ORDERABLE_FIELDS = {
  dateCreated: 'Created at',
  shortCode: 'Short URL',
  longUrl: 'Long URL',
  title: 'Title',
  visits: 'Visits',
};

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
