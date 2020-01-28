import { faAngleDoubleDown as downIcon, faAngleDoubleUp as upIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { assoc, dissoc, isEmpty, isNil, pipe, replace, trim } from 'ramda';
import React from 'react';
import { Collapse, FormGroup, Input } from 'reactstrap';
import * as PropTypes from 'prop-types';
import DateInput from '../utils/DateInput';
import Checkbox from '../utils/Checkbox';
import { serverType } from '../servers/prop-types';
import { compareVersions } from '../utils/utils';
import { createShortUrlResultType } from './reducers/shortUrlCreation';
import UseExistingIfFoundInfoIcon from './UseExistingIfFoundInfoIcon';

const normalizeTag = pipe(trim, replace(/ /g, '-'));
const formatDate = (date) => isNil(date) ? date : date.format();

const CreateShortUrl = (
  TagsSelector,
  CreateShortUrlResult,
  ForServerVersion
) => class CreateShortUrl extends React.Component {
  static propTypes = {
    createShortUrl: PropTypes.func,
    shortUrlCreationResult: createShortUrlResultType,
    resetCreateShortUrl: PropTypes.func,
    selectedServer: serverType,
  };

  state = {
    longUrl: '',
    tags: [],
    customSlug: undefined,
    domain: undefined,
    validSince: undefined,
    validUntil: undefined,
    maxVisits: undefined,
    findIfExists: false,
    moreOptionsVisible: false,
  };

  render() {
    const { createShortUrl, shortUrlCreationResult, resetCreateShortUrl } = this.props;

    const changeTags = (tags) => this.setState({ tags: tags.map(normalizeTag) });
    const renderOptionalInput = (id, placeholder, type = 'text', props = {}) => (
      <FormGroup>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={this.state[id]}
          onChange={(e) => this.setState({ [id]: e.target.value })}
          {...props}
        />
      </FormGroup>
    );
    const renderDateInput = (id, placeholder, props = {}) => (
      <div className="form-group">
        <DateInput
          selected={this.state[id]}
          placeholderText={placeholder}
          isClearable
          onChange={(date) => this.setState({ [id]: date })}
          {...props}
        />
      </div>
    );
    const save = (e) => {
      e.preventDefault();
      createShortUrl(pipe(
        dissoc('moreOptionsVisible'),
        assoc('validSince', formatDate(this.state.validSince)),
        assoc('validUntil', formatDate(this.state.validUntil))
      )(this.state));
    };
    const currentServerVersion = this.props.selectedServer ? this.props.selectedServer.version : '';
    const disableDomain = isEmpty(currentServerVersion) || compareVersions(currentServerVersion, '<', '1.19.0-beta.1');

    return (
      <div className="shlink-container">
        <form onSubmit={save}>
          <div className="form-group">
            <input
              className="form-control form-control-lg"
              type="url"
              placeholder="Insert the URL to be shortened"
              required
              value={this.state.longUrl}
              onChange={(e) => this.setState({ longUrl: e.target.value })}
            />
          </div>

          <Collapse isOpen={this.state.moreOptionsVisible}>
            <div className="form-group">
              <TagsSelector tags={this.state.tags} onChange={changeTags} />
            </div>

            <div className="row">
              <div className="col-sm-6">
                {renderOptionalInput('customSlug', 'Custom slug')}
              </div>
              <div className="col-sm-6">
                {renderOptionalInput('domain', 'Domain', 'text', {
                  disabled: disableDomain,
                  ...disableDomain && { title: 'Shlink 1.19.0 or higher is required to be able to provide the domain' },
                })}
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                {renderOptionalInput('maxVisits', 'Maximum number of visits allowed', 'number', { min: 1 })}
              </div>
              <div className="col-sm-3">
                {renderDateInput('validSince', 'Enabled since...', { maxDate: this.state.validUntil })}
              </div>
              <div className="col-sm-3">
                {renderDateInput('validUntil', 'Enabled until...', { minDate: this.state.validSince })}
              </div>
            </div>

            <ForServerVersion minVersion="1.16.0">
              <div className="mb-4 text-right">
                <Checkbox
                  className="mr-2"
                  checked={this.state.findIfExists}
                  onChange={(findIfExists) => this.setState({ findIfExists })}
                >
                  Use existing URL if found
                </Checkbox>
                <UseExistingIfFoundInfoIcon />
              </div>
            </ForServerVersion>
          </Collapse>

          <div>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => this.setState(({ moreOptionsVisible }) => ({ moreOptionsVisible: !moreOptionsVisible }))}
            >
              <FontAwesomeIcon icon={this.state.moreOptionsVisible ? upIcon : downIcon} />
              &nbsp;
              {this.state.moreOptionsVisible ? 'Less' : 'More'} options
            </button>
            <button
              className="btn btn-outline-primary float-right"
              disabled={shortUrlCreationResult.loading || isEmpty(this.state.longUrl)}
            >
              {shortUrlCreationResult.loading ? 'Creating...' : 'Create'}
            </button>
          </div>

          <CreateShortUrlResult {...shortUrlCreationResult} resetCreateShortUrl={resetCreateShortUrl} />
        </form>
      </div>
    );
  }
};

export default CreateShortUrl;
