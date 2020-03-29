import { faAngleDoubleDown as downIcon, faAngleDoubleUp as upIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty, isNil, pipe, replace, trim } from 'ramda';
import React, { useState } from 'react';
import { Collapse, FormGroup, Input } from 'reactstrap';
import * as PropTypes from 'prop-types';
import DateInput from '../utils/DateInput';
import Checkbox from '../utils/Checkbox';
import { serverType } from '../servers/prop-types';
import { versionMatch } from '../utils/helpers/version';
import { hasValue } from '../utils/utils';
import { useToggle } from '../utils/helpers/hooks';
import { createShortUrlResultType } from './reducers/shortUrlCreation';
import UseExistingIfFoundInfoIcon from './UseExistingIfFoundInfoIcon';

const normalizeTag = pipe(trim, replace(/ /g, '-'));
const formatDate = (date) => isNil(date) ? date : date.format();

const propTypes = {
  createShortUrl: PropTypes.func,
  shortUrlCreationResult: createShortUrlResultType,
  resetCreateShortUrl: PropTypes.func,
  selectedServer: serverType,
};

const CreateShortUrl = (TagsSelector, CreateShortUrlResult, ForServerVersion) => {
  const CreateShortUrlComp = ({ createShortUrl, shortUrlCreationResult, resetCreateShortUrl, selectedServer }) => {
    const [ shortUrlCreation, setShortUrlCreation ] = useState({
      longUrl: '',
      tags: [],
      customSlug: undefined,
      shortCodeLength: undefined,
      domain: undefined,
      validSince: undefined,
      validUntil: undefined,
      maxVisits: undefined,
      findIfExists: false,
    });
    const [ moreOptionsVisible, toggleMoreOptionsVisible ] = useToggle(false);

    const changeTags = (tags) => setShortUrlCreation({ ...shortUrlCreation, tags: tags.map(normalizeTag) });
    const renderOptionalInput = (id, placeholder, type = 'text', props = {}) => (
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
    const renderDateInput = (id, placeholder, props = {}) => (
      <div className="form-group">
        <DateInput
          selected={shortUrlCreation[id]}
          placeholderText={placeholder}
          isClearable
          onChange={(date) => setShortUrlCreation({ ...shortUrlCreation, [id]: date })}
          {...props}
        />
      </div>
    );
    const save = (e) => {
      e.preventDefault();
      createShortUrl({
        ...shortUrlCreation,
        validSince: formatDate(shortUrlCreation.validSince),
        validUntil: formatDate(shortUrlCreation.validUntil),
      });
    };
    const currentServerVersion = selectedServer && selectedServer.version;
    const disableDomain = !versionMatch(currentServerVersion, { minVersion: '1.19.0-beta.1' });
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
            <TagsSelector tags={shortUrlCreation.tags} onChange={changeTags} />
          </div>

          <div className="row">
            <div className="col-sm-4">
              {renderOptionalInput('customSlug', 'Custom slug')}
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
              {renderOptionalInput('domain', 'Domain', 'text', {
                disabled: disableDomain,
                ...disableDomain && { title: 'Shlink 1.19.0 or higher is required to be able to provide the domain' },
              })}
            </div>
          </div>

          <div className="row">
            <div className="col-sm-4">
              {renderOptionalInput('maxVisits', 'Maximum number of visits allowed', 'number', { min: 1 })}
            </div>
            <div className="col-sm-4">
              {renderDateInput('validSince', 'Enabled since...', { maxDate: shortUrlCreation.validUntil })}
            </div>
            <div className="col-sm-4">
              {renderDateInput('validUntil', 'Enabled until...', { minDate: shortUrlCreation.validSince })}
            </div>
          </div>

          <ForServerVersion minVersion="1.16.0">
            <div className="mb-4 text-right">
              <Checkbox
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
            disabled={shortUrlCreationResult.loading || isEmpty(shortUrlCreation.longUrl)}
          >
            {shortUrlCreationResult.loading ? 'Creating...' : 'Create'}
          </button>
        </div>

        <CreateShortUrlResult {...shortUrlCreationResult} resetCreateShortUrl={resetCreateShortUrl} />
      </form>
    );
  };

  CreateShortUrlComp.propTypes = propTypes;

  return CreateShortUrlComp;
};

export default CreateShortUrl;
