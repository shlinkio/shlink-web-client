import { FC } from 'react';
import { FormGroup } from 'reactstrap';
import SortingDropdown from '../utils/SortingDropdown';
import { SORTABLE_FIELDS } from '../short-urls/data';
import { SimpleCard } from '../utils/SimpleCard';
import { DEFAULT_SHORT_URLS_ORDERING, Settings, ShortUrlsListSettings } from './reducers/settings';

interface ShortUrlsListProps {
  settings: Settings;
  setShortUrlsListSettings: (settings: ShortUrlsListSettings) => void;
}

export const ShortUrlsList: FC<ShortUrlsListProps> = ({ settings: { shortUrlsList }, setShortUrlsListSettings }) => (
  <SimpleCard title="Short URLs list" className="h-100">
    <FormGroup className="mb-0">
      <label>Default ordering for short URLs list:</label>
      <SortingDropdown
        items={SORTABLE_FIELDS}
        order={shortUrlsList?.defaultOrdering ?? DEFAULT_SHORT_URLS_ORDERING}
        onChange={(field, dir) => setShortUrlsListSettings({ defaultOrdering: { field, dir } })}
      />
    </FormGroup>
  </SimpleCard>
);
