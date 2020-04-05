import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch as searchIcon } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SearchField.scss';

const DEFAULT_SEARCH_INTERVAL = 500;
let timer;

const propTypes = {
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  large: PropTypes.bool,
  noBorder: PropTypes.bool,
};

const SearchField = ({ onChange, className, placeholder = 'Search...', large = true, noBorder = false }) => {
  const [ searchTerm, setSearchTerm ] = useState('');

  const resetTimer = () => {
    clearTimeout(timer);
    timer = null;
  };
  const searchTermChanged = (newSearchTerm, timeout = DEFAULT_SEARCH_INTERVAL) => {
    setSearchTerm(newSearchTerm);

    resetTimer();

    timer = setTimeout(() => {
      onChange(newSearchTerm);
      resetTimer();
    }, timeout);
  };

  return (
    <div className={classNames('search-field', className)}>
      <input
        type="text"
        className={classNames('form-control search-field__input', {
          'form-control-lg': large,
          'search-field__input--no-border': noBorder,
        })}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => searchTermChanged(e.target.value)}
      />
      <FontAwesomeIcon icon={searchIcon} className="search-field__icon" />
      <div
        className="close search-field__close"
        hidden={searchTerm === ''}
        id="search-field__close"
        onClick={() => searchTermChanged('', 0)}
      >
        &times;
      </div>
    </div>
  );
};

SearchField.propTypes = propTypes;

export default SearchField;
