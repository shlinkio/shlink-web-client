import React from 'react';
import { connect } from 'react-redux';
import { assoc } from 'ramda';
import Paginator from './Paginator';
import SearchBar from './SearchBar';
import ShortUrlsList from './ShortUrlsList';

export function ShortUrlsComponent(props) {
  const { match: { params } } = props;

  // Using a key on a component makes react to create a new instance every time the key changes
  const urlsListKey = `${params.serverId}_${params.page}`;

  return (
    <div className="shlink-container">
      <div className="form-group"><SearchBar /></div>
      <ShortUrlsList {...props} shortUrlsList={props.shortUrlsList.data || []} key={urlsListKey} />
      <Paginator paginator={props.shortUrlsList.pagination} serverId={props.match.params.serverId} />
    </div>
  );
}

const ShortUrls = connect(
  (state) => assoc('shortUrlsList', state.shortUrlsList.shortUrls, state.shortUrlsList)
)(ShortUrlsComponent);

export default ShortUrls;
