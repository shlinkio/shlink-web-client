import calendarIcon from '@fortawesome/fontawesome-free-regular/faCalendarAlt';
import downIcon from '@fortawesome/fontawesome-free-solid/faAngleDoubleDown';
import upIcon from '@fortawesome/fontawesome-free-solid/faAngleDoubleUp';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { assoc, dissoc, isNil, pick, pipe, pluck, replace } from 'ramda';
import React from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import ReactTags from 'react-tag-autocomplete';
import { Collapse } from 'reactstrap';
import '../../node_modules/react-datepicker/dist/react-datepicker.css';
import './CreateShortUrl.scss';
import CreateShortUrlResult from './helpers/CreateShortUrlResult';
import { createShortUrl } from './reducers/shortUrlCreationResult';

export class CreateShortUrl extends React.Component {
  state = {
    longUrl: '',
    tags: [],
    customSlug: undefined,
    validSince: undefined,
    validUntil: undefined,
    maxVisits: undefined,
    moreOptionsVisible: false
  };

  render() {
    const addTag = tag => this.setState({
      tags: [].concat(this.state.tags, assoc('name', replace(/ /g, '-', tag.name), tag))
    });
    const removeTag = i => {
      const tags = this.state.tags.slice(0);
      tags.splice(i, 1);
      this.setState({ tags });
    };
    const renderOptionalInput = (id, placeholder, type = 'text', props = {}) =>
      <input
        className="form-control"
        type={type}
        placeholder={placeholder}
        value={this.state[id]}
        onChange={e => this.setState({ [id]: e.target.value })}
        {...props}
      />;
    const createDateInput = (id, placeholder, props = {}) =>
      <DatePicker
        selected={this.state[id]}
        className="form-control create-short-url__date-input"
        placeholderText={placeholder}
        onChange={date => this.setState({ [id]: date })}
        dateFormat="YYYY-MM-DD"
        readOnly
        {...props}
      />;
    const formatDate = date => isNil(date) ? date : date.format();
    const save = e => {
      e.preventDefault();
      this.props.createShortUrl(pipe(
        dissoc('moreOptionsVisible'), // Remove moreOptionsVisible property
        assoc('tags', pluck('name', this.state.tags)), // Map tags array to use only their names
        assoc('validSince', formatDate(this.state.validSince)),
        assoc('validUntil', formatDate(this.state.validUntil))
      )(this.state));
    };

    return (
      <div className="short-urls-container">
        <form onSubmit={save}>
          <div className="form-group">
            <input
              className="form-control form-control-lg"
              type="url"
              placeholder="Insert the URL to be shortened"
              required
              value={this.state.longUrl}
              onChange={e => this.setState({ longUrl: e.target.value })}
            />
          </div>

          <Collapse isOpen={this.state.moreOptionsVisible}>
            <div className="form-group">
              <ReactTags
                tags={this.state.tags}
                handleAddition={addTag}
                handleDelete={removeTag}
                allowNew={true}
                placeholder="Add tags you want to apply to the URL"
              />
            </div>

            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  {renderOptionalInput('customSlug', 'Custom slug')}
                </div>
                <div className="form-group">
                  {renderOptionalInput('maxVisits', 'Maximum number of visits allowed', 'number', { min: 1 })}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group create-short-url__date-container">
                  {createDateInput('validSince', 'Enabled since...', { maxDate: this.state.validUntil })}
                  <FontAwesomeIcon icon={calendarIcon} className="create-short-url__date-icon" />
                </div>
                <div className="form-group create-short-url__date-container">
                  {createDateInput('validUntil', 'Enabled until...', { minDate: this.state.validSince })}
                  <FontAwesomeIcon icon={calendarIcon} className="create-short-url__date-icon" />
                </div>
              </div>
            </div>
          </Collapse>

          <div>
            <button
              type="button"
              className="btn btn-outline-secondary create-short-url__btn"
              onClick={() => this.setState({ moreOptionsVisible: !this.state.moreOptionsVisible })}
            >
              <FontAwesomeIcon icon={this.state.moreOptionsVisible ? upIcon : downIcon} />
              &nbsp;
              {this.state.moreOptionsVisible ? 'Less' : 'More'} options
            </button>
            <button className="btn btn-outline-primary create-short-url__btn float-right">Create</button>
          </div>

          <CreateShortUrlResult {...this.props.shortUrlCreationResult} />
        </form>
      </div>
    );
  }
}

export default connect(pick(['shortUrlCreationResult']), { createShortUrl })(CreateShortUrl);
