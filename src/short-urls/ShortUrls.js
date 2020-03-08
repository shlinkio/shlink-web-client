import React, { useEffect, useState } from 'react';
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
    const [ urlsListKey, setUrlsListKey ] = useState(`${serverId}_${page}`);

    // Using a key on a component makes react to create a new instance every time the key changes
    // Without it, pagination on the URL will not make the component to be refreshed
    useEffect(() => {
      setUrlsListKey(`${serverId}_${page}`);
    }, [ serverId, page ]);

    return (
      <React.Fragment>
        <div className="form-group"><SearchBar /></div>
        <ShortUrlsList {...props} shortUrlsList={data} key={urlsListKey} />
        <Paginator paginator={pagination} serverId={serverId} />
      </React.Fragment>
    );
  };

  ShortUrlsComponent.propTypes = propTypes;

  return ShortUrlsComponent;
};

export default ShortUrls;
