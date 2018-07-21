import React from 'react';
import './CreateShortUrl.scss';
import downIcon from '@fortawesome/fontawesome-free-solid/faAngleDoubleDown';
import upIcon from '@fortawesome/fontawesome-free-solid/faAngleDoubleUp';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Collapse } from 'reactstrap';
import ReactTags from 'react-tag-autocomplete';
import { assoc, replace } from 'ramda';

export default class CreateShortUrl extends React.Component {
  state = {
    longUrl: '',
    tags: [],
    customSlug: null,
    validSince: null,
    validUntil: null,
    maxVisits: null,
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

    return (
      <div className="short-urls-container">
        <form onSubmit={e => e.preventDefault()}>
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
                classNames={{}}
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
                <div className="form-group">
                  {renderOptionalInput('validSince', 'Enabled since...', 'date')}
                </div>
                <div className="form-group">
                  {renderOptionalInput('validUntil', 'Enabled until...', 'date')}
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
        </form>
      </div>
    );
  }
}
