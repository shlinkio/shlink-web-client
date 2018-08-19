import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import searchIcon from '@fortawesome/fontawesome-free-solid/faSearch';
import PropTypes from 'prop-types';
import './SearchField.scss';

const propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default class SearchField extends React.Component {
  state = { showClearBtn: false, searchTerm: '' };
  timer = null;

  searchTermChanged(searchTerm, timeout = 500) {
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
    return (
      <div className="search-field">
        <input
          type="text"
          className="form-control form-control-lg search-field__input"
          placeholder="Search..."
          onChange={e => this.searchTermChanged(e.target.value)}
          value={this.state.searchTerm}
        />
        <FontAwesomeIcon icon={searchIcon} className="search-field__icon" />
        <div
          className="close search-field__close"
          hidden={! this.state.showClearBtn}
          onClick={() => this.searchTermChanged('', 0)}
          id="search-field__close"
        >
          &times;
        </div>
      </div>
    );
  }
}

SearchField.propTypes = propTypes;
