import React from 'react';
import searchIcon from '@fortawesome/fontawesome-free-solid/faSearch';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import './SearchBar.scss';

export default class SearchBar extends React.Component {
  render() {
    return (
      <div className="search-bar">
        <input type="text" className="form-control form-control-lg search-bar__input" placeholder="Search..." />
        <FontAwesomeIcon icon={searchIcon} className="search-bar__icon" />
      </div>
    );
  }
}
