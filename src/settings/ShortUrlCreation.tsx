import { FC } from 'react';
import { FormGroup } from 'reactstrap';
import { SimpleCard } from '../utils/SimpleCard';
import ToggleSwitch from '../utils/ToggleSwitch';
import { Settings, ShortUrlCreationSettings } from './reducers/settings';

interface ShortUrlCreationProps {
  settings: Settings;
  setShortUrlCreationSettings: (settings: ShortUrlCreationSettings) => void;
}

export const ShortUrlCreation: FC<ShortUrlCreationProps> = (
  { settings: { shortUrlCreation }, setShortUrlCreationSettings },
) => (
  <SimpleCard title="Short URLs creation">
    <FormGroup className="mb-0">
      <ToggleSwitch
        checked={shortUrlCreation?.validateUrls ?? false}
        onChange={(validateUrls) => setShortUrlCreationSettings({ validateUrls })}
      >
        By default, request validation on long URLs when creating new short URLs.
        <small className="form-text text-muted">
          The initial state of the <b>Validate URL</b> checkbox will
          be <b>{shortUrlCreation?.validateUrls ? 'checked' : 'unchecked'}</b>.
        </small>
      </ToggleSwitch>
    </FormGroup>
  </SimpleCard>
);
