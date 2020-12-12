import { FC, useEffect, useState } from 'react';
import { Card } from 'reactstrap';
import Paginator from './Paginator';
import { ShortUrlsListProps } from './ShortUrlsList';

const ShortUrls = (SearchBar: FC, ShortUrlsList: FC<ShortUrlsListProps>) => (props: ShortUrlsListProps) => {
  const { match, shortUrlsList } = props;
  const { page = '1', serverId = '' } = match?.params ?? {};
  const { pagination } = shortUrlsList?.shortUrls ?? {};
  const [ urlsListKey, setUrlsListKey ] = useState(`${serverId}_${page}`);

  // Using a key on a component makes react to create a new instance every time the key changes
  // Without it, pagination on the URL will not make the component to be refreshed
  useEffect(() => {
    setUrlsListKey(`${serverId}_${page}`);
  }, [ serverId, page ]);

  return (
    <>
      <div className="form-group"><SearchBar /></div>
      <Card body className="pb-1">
        <ShortUrlsList {...props} key={urlsListKey} />
        <Paginator paginator={pagination} serverId={serverId} />
      </Card>
    </>
  );
};

export default ShortUrls;
