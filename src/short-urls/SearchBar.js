import searchIcon from '@fortawesome/fontawesome-free-solid/faSearch';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import { listShortUrls } from './reducers/shortUrlsList';
import './SearchBar.scss';
import { pick } from 'ramda';

export class SearchBar extends React.Component {
  state = {
    showClearBtn: false,
    searchTerm: '',
  };
  timer = null;

  render() {
    return (
      <div className="search-bar">
        <input type="text"
               className="form-control form-control-lg search-bar__input"
               placeholder="Search..."
               onChange={e => this.searchTermChanged(e.target.value)}
               value={this.state.searchTerm}
        />
        <FontAwesomeIcon icon={searchIcon} className="search-bar__icon" />
        <div className="close search-bar__close"
             hidden={! this.state.showClearBtn}
             onClick={() => this.searchTermChanged('')}
             id="search-bar__close"
        >
          &times;
        </div>
      </div>
    );
  }

  searchTermChanged(searchTerm) {
    this.setState({
      showClearBtn: searchTerm !== '',
      searchTerm: searchTerm,
    });

    const resetTimer = () => {
      clearTimeout(this.timer);
      this.timer = null;
    };
    resetTimer();

    this.timer = setTimeout(() => {
      this.props.listShortUrls({ ...this.props.shortUrlsListParams, searchTerm });
      resetTimer();
    }, 500);
  }
}

export default connect(pick(['shortUrlsListParams']), { listShortUrls })(SearchBar);
