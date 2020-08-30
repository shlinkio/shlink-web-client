import React, { FC, useEffect, useState } from 'react';
import { ShlinkShortUrlsResponse } from '../utils/services/types';
import Paginator from './Paginator';
import { ShortUrlsListProps, WithList } from './ShortUrlsList';

interface ShortUrlsProps extends ShortUrlsListProps {
  shortUrlsList?: ShlinkShortUrlsResponse;
}

const ShortUrls = (SearchBar: FC, ShortUrlsList: FC<ShortUrlsListProps & WithList>) => (props: ShortUrlsProps) => {
  const { match, shortUrlsList } = props;
  const { page = '1', serverId = '' } = match?.params ?? {};
  const { data = [], pagination } = shortUrlsList ?? {};
  const [ urlsListKey, setUrlsListKey ] = useState(`${serverId}_${page}`);

  // Using a key on a component makes react to create a new instance every time the key changes
  // Without it, pagination on the URL will not make the component to be refreshed
  useEffect(() => {
    setUrlsListKey(`${serverId}_${page}`);
  }, [ serverId, page ]);

  return (
    <React.Fragment>
      <div className="form-group"><SearchBar /></div>
      <div>
        <ShortUrlsList {...props} shortUrlsList={data} key={urlsListKey} />
        <Paginator paginator={pagination} serverId={serverId} />
      </div>
    </React.Fragment>
  );
};

export default ShortUrls;
