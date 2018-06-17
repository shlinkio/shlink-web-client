import React from 'react';
import { connect } from 'react-redux';
import SearchBar from './SearchBar';
import './ShortUrls.scss';
import ShortUrlsList from './ShortUrlsList';

export function ShortUrls(props) {
  return (
    <div className="short-urls-container">
      <div className="form-group"><SearchBar /></div>
      <ShortUrlsList {...props} shortUrlsList={props.shortUrlsList.data || []} />
      {/* Pagination */}
    </div>
  );
}

export default connect(state => ({
  shortUrlsList: state.shortUrlsList
}))(ShortUrls);
