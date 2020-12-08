import { isEmpty, pipe, replace, trim } from 'ramda';
import { FC, useState } from 'react';
import { Button, FormGroup, Input } from 'reactstrap';
import { InputType } from 'reactstrap/lib/Input';
import * as m from 'moment';
import DateInput, { DateInputProps } from '../utils/DateInput';
import Checkbox from '../utils/Checkbox';
import { versionMatch, Versions } from '../utils/helpers/version';
import { handleEventPreventingDefault, hasValue } from '../utils/utils';
import { isReachableServer, SelectedServer } from '../servers/data';
import { formatIsoDate } from '../utils/helpers/date';
import { TagsSelectorProps } from '../tags/helpers/TagsSelector';
import { DomainSelectorProps } from '../domains/DomainSelector';
import { ShortUrlData } from './data';
import { ShortUrlCreation } from './reducers/shortUrlCreation';
import UseExistingIfFoundInfoIcon from './UseExistingIfFoundInfoIcon';
import { CreateShortUrlResultProps } from './helpers/CreateShortUrlResult';
import './CreateShortUrl.scss';

export interface CreateShortUrlProps {
  basicMode?: boolean;
}

interface CreateShortUrlConnectProps extends CreateShortUrlProps {
  shortUrlCreationResult: ShortUrlCreation;
  selectedServer: SelectedServer;
  createShortUrl: (data: ShortUrlData) => Promise<void>;
  resetCreateShortUrl: () => void;
}

export const normalizeTag = pipe(trim, replace(/ /g, '-'));

const initialState: ShortUrlData = {
  longUrl: '',
  tags: [],
  customSlug: '',
  shortCodeLength: undefined,
  domain: '',
  validSince: undefined,
  validUntil: undefined,
  maxVisits: undefined,
  findIfExists: false,
  validateUrl: true,
};

type NonDateFields = 'longUrl' | 'customSlug' | 'shortCodeLength' | 'domain' | 'maxVisits';
type DateFields = 'validSince' | 'validUntil';

const CreateShortUrl = (
  TagsSelector: FC<TagsSelectorProps>,
  CreateShortUrlResult: FC<CreateShortUrlResultProps>,
  ForServerVersion: FC<Versions>,
  DomainSelector: FC<DomainSelectorProps>,
) => ({
  createShortUrl,
  shortUrlCreationResult,
  resetCreateShortUrl,
  selectedServer,
  basicMode = false,
}: CreateShortUrlConnectProps) => {
  const [ shortUrlCreation, setShortUrlCreation ] = useState(initialState);

  const changeTags = (tags: string[]) => setShortUrlCreation({ ...shortUrlCreation, tags: tags.map(normalizeTag) });
  const reset = () => setShortUrlCreation(initialState);
  const save = handleEventPreventingDefault(() => {
    const shortUrlData = {
      ...shortUrlCreation,
      validSince: formatIsoDate(shortUrlCreation.validSince) ?? undefined,
      validUntil: formatIsoDate(shortUrlCreation.validUntil) ?? undefined,
    };

    createShortUrl(shortUrlData).then(reset).catch(() => {});
  });
  const renderOptionalInput = (id: NonDateFields, placeholder: string, type: InputType = 'text', props = {}) => (
    <FormGroup>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={shortUrlCreation[id]}
        onChange={(e) => setShortUrlCreation({ ...shortUrlCreation, [id]: e.target.value })}
        {...props}
      />
    </FormGroup>
  );
  const renderDateInput = (id: DateFields, placeholder: string, props: Partial<DateInputProps> = {}) => (
    <div className="form-group">
      <DateInput
        selected={shortUrlCreation[id] as m.Moment | null}
        placeholderText={placeholder}
        isClearable
        onChange={(date) => setShortUrlCreation({ ...shortUrlCreation, [id]: date })}
        {...props}
      />
    </div>
  );

  const currentServerVersion = isReachableServer(selectedServer) ? selectedServer.version : '';
  const disableDomain = !versionMatch(currentServerVersion, { minVersion: '1.19.0-beta.1' });
  const showDomainSelector = versionMatch(currentServerVersion, { minVersion: '2.4.0' });
  const disableShortCodeLength = !versionMatch(currentServerVersion, { minVersion: '2.1.0' });

  return (
    <form onSubmit={save}>
      <FormGroup>
        <Input
          bsSize="lg"
          type="url"
          placeholder="URL to be shortened"
          required
          value={shortUrlCreation.longUrl}
          onChange={(e) => setShortUrlCreation({ ...shortUrlCreation, longUrl: e.target.value })}
        />
      </FormGroup>

      <FormGroup>
        <TagsSelector tags={shortUrlCreation.tags ?? []} onChange={changeTags} />
      </FormGroup>

      {!basicMode && (
        <>
          <div className="row">
            <div className="col-sm-4">
              {renderOptionalInput('customSlug', 'Custom slug', 'text', {
                disabled: hasValue(shortUrlCreation.shortCodeLength),
              })}
            </div>
            <div className="col-sm-4">
              {renderOptionalInput('shortCodeLength', 'Short code length', 'number', {
                min: 4,
                disabled: disableShortCodeLength || hasValue(shortUrlCreation.customSlug),
                ...disableShortCodeLength && {
                  title: 'Shlink 2.1.0 or higher is required to be able to provide the short code length',
                },
              })}
            </div>
            <div className="col-sm-4">
              {!showDomainSelector && renderOptionalInput('domain', 'Domain', 'text', {
                disabled: disableDomain,
                ...disableDomain && { title: 'Shlink 1.19.0 or higher is required to be able to provide the domain' },
              })}
              {showDomainSelector && (
                <FormGroup>
                  <DomainSelector
                    value={shortUrlCreation.domain}
                    onChange={(domain?: string) => setShortUrlCreation({ ...shortUrlCreation, domain })}
                  />
                </FormGroup>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-sm-4">
              {renderOptionalInput('maxVisits', 'Maximum number of visits allowed', 'number', { min: 1 })}
            </div>
            <div className="col-sm-4">
              {renderDateInput('validSince', 'Enabled since...', { maxDate: shortUrlCreation.validUntil as m.Moment | undefined })}
            </div>
            <div className="col-sm-4">
              {renderDateInput('validUntil', 'Enabled until...', { minDate: shortUrlCreation.validSince as m.Moment | undefined })}
            </div>
          </div>

          <ForServerVersion minVersion="1.16.0">
            <div className="mb-4 row">
              <div className="col-sm-6 text-center text-sm-left mb-2 mb-sm-0">
                <ForServerVersion minVersion="2.4.0">
                  <Checkbox
                    inline
                    checked={shortUrlCreation.validateUrl}
                    onChange={(validateUrl) => setShortUrlCreation({ ...shortUrlCreation, validateUrl })}
                  >
                    Validate URL
                  </Checkbox>
                </ForServerVersion>
              </div>
              <div className="col-sm-6 text-center text-sm-right">
                <Checkbox
                  inline
                  className="mr-2"
                  checked={shortUrlCreation.findIfExists}
                  onChange={(findIfExists) => setShortUrlCreation({ ...shortUrlCreation, findIfExists })}
                >
                  Use existing URL if found
                </Checkbox>
                <UseExistingIfFoundInfoIcon />
              </div>
            </div>
          </ForServerVersion>
        </>
      )}

      <div className="text-right">
        <Button
          outline
          color="primary"
          disabled={shortUrlCreationResult.saving || isEmpty(shortUrlCreation.longUrl)}
          className="create-short-url__save-btn"
        >
          {shortUrlCreationResult.saving ? 'Creating...' : 'Create'}
        </Button>
      </div>

      <CreateShortUrlResult
        {...shortUrlCreationResult}
        resetCreateShortUrl={resetCreateShortUrl}
        canBeClosed={basicMode}
      />
    </form>
  );
};

export default CreateShortUrl;
