import { FC, ReactNode } from 'react';
import { DropdownItem, FormGroup } from 'reactstrap';
import { SimpleCard } from '../utils/SimpleCard';
import ToggleSwitch from '../utils/ToggleSwitch';
import { DropdownBtn } from '../utils/DropdownBtn';
import { Settings, ShortUrlCreationSettings, TagFilteringMode } from './reducers/settings';

interface ShortUrlCreationProps {
  settings: Settings;
  setShortUrlCreationSettings: (settings: ShortUrlCreationSettings) => void;
}

const tagFilteringModeText = (tagFilteringMode: TagFilteringMode | undefined): string =>
  tagFilteringMode === 'includes' ? 'Suggest tags including input' : 'Suggest tags starting with input';
const tagFilteringModeHint = (tagFilteringMode: TagFilteringMode | undefined): ReactNode =>
  tagFilteringMode === 'includes'
    ? <>The list of suggested tags will contain existing ones <b>including</b> provided input.</>
    : <>The list of suggested tags will contain existing ones <b>starting with</b> provided input.</>;

export const ShortUrlCreation: FC<ShortUrlCreationProps> = ({ settings, setShortUrlCreationSettings }) => {
  const shortUrlCreation: ShortUrlCreationSettings = settings.shortUrlCreation ?? { validateUrls: false };
  const changeTagsFilteringMode = (tagFilteringMode: TagFilteringMode) => () => setShortUrlCreationSettings(
    { ...shortUrlCreation ?? { validateUrls: false }, tagFilteringMode },
  );

  return (
    <SimpleCard title="Short URLs creation" className="h-100">
      <FormGroup>
        <ToggleSwitch
          checked={shortUrlCreation.validateUrls ?? false}
          onChange={(validateUrls) => setShortUrlCreationSettings({ ...shortUrlCreation, validateUrls })}
        >
          By default, request validation on long URLs when creating new short URLs.
          <small className="form-text text-muted">
            The initial state of the <b>Validate URL</b> checkbox will
            be <b>{shortUrlCreation.validateUrls ? 'checked' : 'unchecked'}</b>.
          </small>
        </ToggleSwitch>
      </FormGroup>
      <FormGroup className="mb-0">
        <label>Tag suggestions search mode:</label>
        <DropdownBtn text={tagFilteringModeText(shortUrlCreation.tagFilteringMode)}>
          <DropdownItem
            active={!shortUrlCreation.tagFilteringMode || shortUrlCreation.tagFilteringMode === 'startsWith'}
            onClick={changeTagsFilteringMode('startsWith')}
          >
            {tagFilteringModeText('startsWith')}
          </DropdownItem>
          <DropdownItem
            active={shortUrlCreation.tagFilteringMode === 'includes'}
            onClick={changeTagsFilteringMode('includes')}
          >
            {tagFilteringModeText('includes')}
          </DropdownItem>
        </DropdownBtn>
        <small className="form-text text-muted">
          {tagFilteringModeHint(shortUrlCreation.tagFilteringMode)}
        </small>
      </FormGroup>
    </SimpleCard>
  );
}
