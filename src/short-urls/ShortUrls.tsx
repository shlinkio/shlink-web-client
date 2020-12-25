import { FC, useEffect, useState } from 'react';
import { ShortUrlsListProps } from './ShortUrlsList';

const ShortUrls = (SearchBar: FC, ShortUrlsList: FC<ShortUrlsListProps>) => (props: ShortUrlsListProps) => {
  const { match } = props;
  const { page = '1', serverId = '' } = match?.params ?? {};
  const [ urlsListKey, setUrlsListKey ] = useState(`${serverId}_${page}`);

  // Using a key on a component makes react to create a new instance every time the key changes
  // Without it, pagination on the URL will not make the component to be refreshed
  useEffect(() => {
    setUrlsListKey(`${serverId}_${page}`);
  }, [ serverId, page ]);

  return (
    <>
      <div className="form-group"><SearchBar /></div>
      <ShortUrlsList {...props} key={urlsListKey} />
    </>
  );
};

export default ShortUrls;
