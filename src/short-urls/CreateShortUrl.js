import downIcon from '@fortawesome/fontawesome-free-solid/faAngleDoubleDown';
import upIcon from '@fortawesome/fontawesome-free-solid/faAngleDoubleUp';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { assoc, dissoc, isNil, pipe, replace, trim } from 'ramda';
import React from 'react';
import { Collapse } from 'reactstrap';
import * as PropTypes from 'prop-types';
import DateInput from '../utils/DateInput';
import CreateShortUrlResult from './helpers/CreateShortUrlResult';
import { createShortUrlResultType } from './reducers/shortUrlCreation';

const normalizeTag = pipe(trim, replace(/ /g, '-'));
const formatDate = (date) => isNil(date) ? date : date.format();

const CreateShortUrl = (TagsSelector) => class CreateShortUrl extends React.Component {
  static propTypes = {
    createShortUrl: PropTypes.func,
    shortUrlCreationResult: createShortUrlResultType,
    resetCreateShortUrl: PropTypes.func,
  };

  state = {
    longUrl: '',
    tags: [],
    customSlug: undefined,
    validSince: undefined,
    validUntil: undefined,
    maxVisits: undefined,
    moreOptionsVisible: false,
  };

  render() {
    const { createShortUrl, shortUrlCreationResult, resetCreateShortUrl } = this.props;

    const changeTags = (tags) => this.setState({ tags: tags.map(normalizeTag) });
    const renderOptionalInput = (id, placeholder, type = 'text', props = {}) => (
      <div className="form-group">
        <input
          className="form-control"
          id={id}
          type={type}
          placeholder={placeholder}
          value={this.state[id]}
          onChange={(e) => this.setState({ [id]: e.target.value })}
          {...props}
        />
      </div>
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
                {renderOptionalInput('maxVisits', 'Maximum number of visits allowed', 'number', { min: 1 })}
              </div>
              <div className="col-sm-6">
                {renderDateInput('validSince', 'Enabled since...', { maxDate: this.state.validUntil })}
                {renderDateInput('validUntil', 'Enabled until...', { minDate: this.state.validSince })}
              </div>
            </div>
          </Collapse>

          <div>
            <button
              type="button"
              className="btn btn-outline-secondary create-short-url__btn"
              onClick={() => this.setState(({ moreOptionsVisible }) => ({ moreOptionsVisible: !moreOptionsVisible }))}
            >
              <FontAwesomeIcon icon={this.state.moreOptionsVisible ? upIcon : downIcon} />
              &nbsp;
              {this.state.moreOptionsVisible ? 'Less' : 'More'} options
            </button>
            <button
              className="btn btn-outline-primary create-short-url__btn float-right"
              disabled={shortUrlCreationResult.loading}
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
