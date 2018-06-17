import React from 'react';
import SearchBar from './SearchBar';
import ShortUrlsList from './ShortUrlsList';
import './ShortUrls.scss';

export default function ShortUrls(props) {
  return (
    <div className="short-urls-container">
      <div className="form-group"><SearchBar /></div>
      <ShortUrlsList {...props} />
    </div>
  );
}
