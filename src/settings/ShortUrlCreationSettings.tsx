import { FC, ReactNode } from 'react';
import { DropdownItem, FormGroup } from 'reactstrap';
import { SimpleCard } from '../utils/SimpleCard';
import ToggleSwitch from '../utils/ToggleSwitch';
import { DropdownBtn } from '../utils/DropdownBtn';
import { FormText } from '../utils/forms/FormText';
import { LabeledFormGroup } from '../utils/forms/LabeledFormGroup';
import { Settings, ShortUrlCreationSettings as ShortUrlsSettings, TagFilteringMode } from './reducers/settings';

interface ShortUrlCreationProps {
  settings: Settings;
  setShortUrlCreationSettings: (settings: ShortUrlsSettings) => void;
}

const tagFilteringModeText = (tagFilteringMode: TagFilteringMode | undefined): string =>
  (tagFilteringMode === 'includes' ? 'Suggest tags including input' : 'Suggest tags starting with input');
const tagFilteringModeHint = (tagFilteringMode: TagFilteringMode | undefined): ReactNode => (
  tagFilteringMode === 'includes'
    ? <>The list of suggested tags will contain those <b>including</b> provided input.</>
    : <>The list of suggested tags will contain those <b>starting with</b> provided input.</>
);

export const ShortUrlCreationSettings: FC<ShortUrlCreationProps> = ({ settings, setShortUrlCreationSettings }) => {
  const shortUrlCreation: ShortUrlsSettings = settings.shortUrlCreation ?? { validateUrls: false };
  const changeTagsFilteringMode = (tagFilteringMode: TagFilteringMode) => () => setShortUrlCreationSettings(
    { ...shortUrlCreation ?? { validateUrls: false }, tagFilteringMode },
  );

  return (
    <SimpleCard title="Short URLs form" className="h-100">
      <FormGroup>
        <ToggleSwitch
          checked={shortUrlCreation.validateUrls ?? false}
          onChange={(validateUrls) => setShortUrlCreationSettings({ ...shortUrlCreation, validateUrls })}
        >
          Request validation on long URLs when creating new short URLs.
          <FormText>
            The initial state of the <b>Validate URL</b> checkbox will
            be <b>{shortUrlCreation.validateUrls ? 'checked' : 'unchecked'}</b>.
          </FormText>
        </ToggleSwitch>
      </FormGroup>
      <FormGroup>
        <ToggleSwitch
          checked={shortUrlCreation.forwardQuery ?? true}
          onChange={(forwardQuery) => setShortUrlCreationSettings({ ...shortUrlCreation, forwardQuery })}
        >
          Make all new short URLs forward their query params to the long URL.
          <FormText>
            The initial state of the <b>Forward query params on redirect</b> checkbox will
            be <b>{shortUrlCreation.forwardQuery ?? true ? 'checked' : 'unchecked'}</b>.
          </FormText>
        </ToggleSwitch>
      </FormGroup>
      <LabeledFormGroup noMargin label="Tag suggestions search mode:">
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
        <FormText>{tagFilteringModeHint(shortUrlCreation.tagFilteringMode)}</FormText>
      </LabeledFormGroup>
    </SimpleCard>
  );
};
