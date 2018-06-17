import React from 'react';
import { connect } from 'react-redux';
import Paginator from './Paginator';
import SearchBar from './SearchBar';
import './ShortUrls.scss';
import ShortUrlsList from './ShortUrlsList';

export function ShortUrls(props) {
  return (
    <div className="short-urls-container">
      <div className="form-group"><SearchBar /></div>
      <ShortUrlsList {...props} shortUrlsList={props.shortUrlsList.data || []} />
      <Paginator paginator={props.shortUrlsList.pagination} serverId={props.match.params.serverId} />
    </div>
  );
}

export default connect(state => ({
  shortUrlsList: state.shortUrlsList
}))(ShortUrls);
