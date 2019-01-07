import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch as searchIcon } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './SearchField.scss';

const DEFAULT_SEARCH_INTERVAL = 500;

export default class SearchField extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string,
  };
  static defaultProps = {
    className: '',
    placeholder: 'Search...',
  };

  state = { showClearBtn: false, searchTerm: '' };
  timer = null;

  searchTermChanged(searchTerm, timeout = DEFAULT_SEARCH_INTERVAL) {
    this.setState({
      showClearBtn: searchTerm !== '',
      searchTerm,
    });

    const resetTimer = () => {
      clearTimeout(this.timer);
      this.timer = null;
    };

    resetTimer();

    this.timer = setTimeout(() => {
      this.props.onChange(searchTerm);
      resetTimer();
    }, timeout);
  }

  render() {
    const { className, placeholder } = this.props;

    return (
      <div className={classnames('search-field', className)}>
        <input
          type="text"
          className="form-control form-control-lg search-field__input"
          placeholder={placeholder}
          value={this.state.searchTerm}
          onChange={(e) => this.searchTermChanged(e.target.value)}
        />
        <FontAwesomeIcon icon={searchIcon} className="search-field__icon" />
        <div
          className="close search-field__close"
          hidden={!this.state.showClearBtn}
          id="search-field__close"
          onClick={() => this.searchTermChanged('', 0)}
        >
          &times;
        </div>
      </div>
    );
  }
}
