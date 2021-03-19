import { FC, useState } from 'react';
import { InputType } from 'reactstrap/lib/Input';
import { Button, FormGroup, Input } from 'reactstrap';
import { isEmpty } from 'ramda';
import * as m from 'moment';
import DateInput, { DateInputProps } from '../utils/DateInput';
import { supportsListingDomains, supportsSettingShortCodeLength } from '../utils/helpers/features';
import { SimpleCard } from '../utils/SimpleCard';
import { handleEventPreventingDefault, hasValue } from '../utils/utils';
import Checkbox from '../utils/Checkbox';
import { SelectedServer } from '../servers/data';
import { TagsSelectorProps } from '../tags/helpers/TagsSelector';
import { Versions } from '../utils/helpers/version';
import { DomainSelectorProps } from '../domains/DomainSelector';
import { formatIsoDate } from '../utils/helpers/date';
import UseExistingIfFoundInfoIcon from './UseExistingIfFoundInfoIcon';
import { normalizeTag } from './CreateShortUrl';
import { ShortUrlData } from './data';
import './ShortUrlForm.scss';

type Mode = 'create' | 'create-basic' | 'edit';
type DateFields = 'validSince' | 'validUntil';
type NonDateFields = 'longUrl' | 'customSlug' | 'shortCodeLength' | 'domain' | 'maxVisits' | 'title';

export interface ShortUrlFormProps {
  mode: Mode;
  saving: boolean;
  initialState: ShortUrlData;
  onSave: (shortUrlData: ShortUrlData) => Promise<unknown>;
  selectedServer: SelectedServer;
}

export const ShortUrlForm = (
  TagsSelector: FC<TagsSelectorProps>,
  ForServerVersion: FC<Versions>,
  DomainSelector: FC<DomainSelectorProps>,
): FC<ShortUrlFormProps> => ({ mode, saving, onSave, initialState, selectedServer, children }) => {
  const [ shortUrlData, setShortUrlData ] = useState(initialState);
  const changeTags = (tags: string[]) => setShortUrlData({ ...shortUrlData, tags: tags.map(normalizeTag) });
  const reset = () => setShortUrlData(initialState);
  const submit = handleEventPreventingDefault(async () => onSave({
    ...shortUrlData,
    validSince: formatIsoDate(shortUrlData.validSince) ?? undefined,
    validUntil: formatIsoDate(shortUrlData.validUntil) ?? undefined,
  }).then(reset).catch(() => {}));

  const renderOptionalInput = (id: NonDateFields, placeholder: string, type: InputType = 'text', props = {}) => (
    <FormGroup>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={shortUrlData[id]}
        onChange={(e) => setShortUrlData({ ...shortUrlData, [id]: e.target.value })}
        {...props}
      />
    </FormGroup>
  );
  const renderDateInput = (id: DateFields, placeholder: string, props: Partial<DateInputProps> = {}) => (
    <div className="form-group">
      <DateInput
        selected={shortUrlData[id] as m.Moment | null}
        placeholderText={placeholder}
        isClearable
        onChange={(date) => setShortUrlData({ ...shortUrlData, [id]: date })}
        {...props}
      />
    </div>
  );
  const basicComponents = (
    <>
      <FormGroup>
        <Input
          bsSize="lg"
          type="url"
          placeholder="URL to be shortened"
          required
          value={shortUrlData.longUrl}
          onChange={(e) => setShortUrlData({ ...shortUrlData, longUrl: e.target.value })}
        />
      </FormGroup>

      <FormGroup>
        <TagsSelector tags={shortUrlData.tags ?? []} onChange={changeTags} />
      </FormGroup>
    </>
  );

  const showDomainSelector = supportsListingDomains(selectedServer);
  const disableShortCodeLength = !supportsSettingShortCodeLength(selectedServer);

  return (
    <form className="short-url-form" onSubmit={submit}>
      {mode === 'create-basic' && basicComponents}
      {mode !== 'create-basic' && (
        <>
          <SimpleCard title="Basic options" className="mb-3">
            {basicComponents}
          </SimpleCard>

          <div className="row">
            <div className="col-sm-6 mb-3">
              <SimpleCard title="Customize the short URL">
                {renderOptionalInput('customSlug', 'Custom slug', 'text', {
                  disabled: hasValue(shortUrlData.shortCodeLength),
                })}
                {renderOptionalInput('shortCodeLength', 'Short code length', 'number', {
                  min: 4,
                  disabled: disableShortCodeLength || hasValue(shortUrlData.customSlug),
                  ...disableShortCodeLength && {
                    title: 'Shlink 2.1.0 or higher is required to be able to provide the short code length',
                  },
                })}
                {!showDomainSelector && renderOptionalInput('domain', 'Domain', 'text')}
                {showDomainSelector && (
                  <FormGroup>
                    <DomainSelector
                      value={shortUrlData.domain}
                      onChange={(domain?: string) => setShortUrlData({ ...shortUrlData, domain })}
                    />
                  </FormGroup>
                )}
              </SimpleCard>
            </div>

            <div className="col-sm-6 mb-3">
              <SimpleCard title="Limit access to the short URL">
                {renderOptionalInput('maxVisits', 'Maximum number of visits allowed', 'number', { min: 1 })}
                {renderDateInput('validSince', 'Enabled since...', { maxDate: shortUrlData.validUntil as m.Moment | undefined })}
                {renderDateInput('validUntil', 'Enabled until...', { minDate: shortUrlData.validSince as m.Moment | undefined })}
              </SimpleCard>
            </div>
          </div>

          <SimpleCard title="Extra validations" className="mb-3">
            <p>
              Make sure the long URL is valid, or ensure an existing short URL is returned if it matches all
              provided data.
            </p>
            <ForServerVersion minVersion="2.4.0">
              <p>
                <Checkbox
                  inline
                  checked={shortUrlData.validateUrl}
                  onChange={(validateUrl) => setShortUrlData({ ...shortUrlData, validateUrl })}
                >
                  Validate URL
                </Checkbox>
              </p>
            </ForServerVersion>
            <p>
              <Checkbox
                inline
                className="mr-2"
                checked={shortUrlData.findIfExists}
                onChange={(findIfExists) => setShortUrlData({ ...shortUrlData, findIfExists })}
              >
                Use existing URL if found
              </Checkbox>
              <UseExistingIfFoundInfoIcon />
            </p>
          </SimpleCard>
        </>
      )}

      <div className="text-center">
        <Button
          outline
          color="primary"
          disabled={saving || isEmpty(shortUrlData.longUrl)}
          className="btn-xs-block"
        >
          {saving ? 'Creating...' : 'Create'}
        </Button>
      </div>

      {children}
    </form>
  );
};
