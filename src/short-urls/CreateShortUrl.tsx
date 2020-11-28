import { faAngleDoubleDown as downIcon, faAngleDoubleUp as upIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty, pipe, replace, trim } from 'ramda';
import { FC, useState } from 'react';
import { Collapse, FormGroup, Input } from 'reactstrap';
import { InputType } from 'reactstrap/lib/Input';
import * as m from 'moment';
import DateInput, { DateInputProps } from '../utils/DateInput';
import Checkbox from '../utils/Checkbox';
import { versionMatch, Versions } from '../utils/helpers/version';
import { handleEventPreventingDefault, hasValue } from '../utils/utils';
import { useToggle } from '../utils/helpers/hooks';
import { isReachableServer, SelectedServer } from '../servers/data';
import { formatIsoDate } from '../utils/helpers/date';
import { TagsSelectorProps } from '../tags/helpers/TagsSelector';
import { DomainsDropdownProps } from '../domains/DomainsDropdown';
import { ShortUrlData } from './data';
import { ShortUrlCreation } from './reducers/shortUrlCreation';
import UseExistingIfFoundInfoIcon from './UseExistingIfFoundInfoIcon';
import { CreateShortUrlResultProps } from './helpers/CreateShortUrlResult';

const normalizeTag = pipe(trim, replace(/ /g, '-'));

interface CreateShortUrlProps {
  shortUrlCreationResult: ShortUrlCreation;
  selectedServer: SelectedServer;
  createShortUrl: Function;
  resetCreateShortUrl: () => void;
}

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
};

type NonDateFields = 'longUrl' | 'customSlug' | 'shortCodeLength' | 'domain' | 'maxVisits';
type DateFields = 'validSince' | 'validUntil';

const CreateShortUrl = (
  TagsSelector: FC<TagsSelectorProps>,
  CreateShortUrlResult: FC<CreateShortUrlResultProps>,
  ForServerVersion: FC<Versions>,
  DomainsDropdown: FC<DomainsDropdownProps>,
) => ({ createShortUrl, shortUrlCreationResult, resetCreateShortUrl, selectedServer }: CreateShortUrlProps) => {
  const [ shortUrlCreation, setShortUrlCreation ] = useState(initialState);
  const [ moreOptionsVisible, toggleMoreOptionsVisible ] = useToggle();

  const changeTags = (tags: string[]) => setShortUrlCreation({ ...shortUrlCreation, tags: tags.map(normalizeTag) });
  const reset = () => setShortUrlCreation(initialState);
  const save = handleEventPreventingDefault(() => {
    const shortUrlData = {
      ...shortUrlCreation,
      validSince: formatIsoDate(shortUrlCreation.validSince),
      validUntil: formatIsoDate(shortUrlCreation.validUntil),
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
  const showDomainsDropdown = versionMatch(currentServerVersion, { minVersion: '2.4.0' });
  const disableShortCodeLength = !versionMatch(currentServerVersion, { minVersion: '2.1.0' });

  return (
    <form onSubmit={save}>
      <div className="form-group">
        <input
          className="form-control form-control-lg"
          type="url"
          placeholder="Insert the URL to be shortened"
          required
          value={shortUrlCreation.longUrl}
          onChange={(e) => setShortUrlCreation({ ...shortUrlCreation, longUrl: e.target.value })}
        />
      </div>

      <Collapse isOpen={moreOptionsVisible}>
        <div className="form-group">
          <TagsSelector tags={shortUrlCreation.tags ?? []} onChange={changeTags} />
        </div>

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
            {!showDomainsDropdown && renderOptionalInput('domain', 'Domain', 'text', {
              disabled: disableDomain,
              ...disableDomain && { title: 'Shlink 1.19.0 or higher is required to be able to provide the domain' },
            })}
            {showDomainsDropdown && (
              <FormGroup>
                <DomainsDropdown
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
          <div className="mb-4 text-right">
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
        </ForServerVersion>
      </Collapse>

      <div>
        <button type="button" className="btn btn-outline-secondary" onClick={toggleMoreOptionsVisible}>
          <FontAwesomeIcon icon={moreOptionsVisible ? upIcon : downIcon} />
          &nbsp;
          {moreOptionsVisible ? 'Less' : 'More'} options
        </button>
        <button
          className="btn btn-outline-primary float-right"
          disabled={shortUrlCreationResult.saving || isEmpty(shortUrlCreation.longUrl)}
        >
          {shortUrlCreationResult.saving ? 'Creating...' : 'Create'}
        </button>
      </div>

      <CreateShortUrlResult {...shortUrlCreationResult} resetCreateShortUrl={resetCreateShortUrl} />
    </form>
  );
};

export default CreateShortUrl;
