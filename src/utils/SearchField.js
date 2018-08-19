import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import searchIcon from '@fortawesome/fontawesome-free-solid/faSearch';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './SearchField.scss';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};
const defaultProps = {
  className: '',
  placeholder: 'Search...',
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
    const { className, placeholder } = this.props;

    return (
      <div className={classnames('search-field', className)}>
        <input
          type="text"
          className="form-control form-control-lg search-field__input"
          placeholder={placeholder}
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
SearchField.defaultProps = defaultProps;
