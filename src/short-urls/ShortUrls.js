import React from 'react';
import PropTypes from 'prop-types';
import Paginator from './Paginator';

const ShortUrls = (SearchBar, ShortUrlsList) => {
  const propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    shortUrlsList: PropTypes.object,
  };

  const ShortUrlsComponent = (props) => {
    const { match: { params }, shortUrlsList } = props;
    const { page, serverId } = params;
    const { data = [], pagination } = shortUrlsList;

    // Using a key on a component makes react to create a new instance every time the key changes
    const urlsListKey = `${serverId}_${page}`;

    return (
      <div className="shlink-container">
        <div className="form-group"><SearchBar /></div>
        <ShortUrlsList {...props} shortUrlsList={data} key={urlsListKey} />
        <Paginator paginator={pagination} serverId={serverId} />
      </div>
    );
  };

  ShortUrlsComponent.propTypes = propTypes;

  return ShortUrlsComponent;
};

export default ShortUrls;
