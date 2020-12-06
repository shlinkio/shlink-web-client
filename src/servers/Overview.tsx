import { useEffect } from 'react';
import { Card, CardText, CardTitle } from 'reactstrap';
import { ShortUrlsListParams } from '../short-urls/reducers/shortUrlsListParams';
import { ShortUrlsList as ShortUrlsListState } from '../short-urls/reducers/shortUrlsList';
import { prettify } from '../utils/helpers/numbers';
import { TagsList } from '../tags/reducers/tagsList';

interface OverviewConnectProps {
  shortUrlsList: ShortUrlsListState;
  listShortUrls: (params: ShortUrlsListParams) => void;
  listTags: Function;
  tagsList: TagsList;
}

export const Overview = ({ shortUrlsList, listShortUrls, listTags, tagsList }: OverviewConnectProps) => {
  const { loading, error, shortUrls } = shortUrlsList;
  const { loading: loadingTags } = tagsList;

  useEffect(() => {
    listShortUrls({ itemsPerPage: 5 });
    listTags();
  }, []);

  return (
    <div className="row">
      <div className="col-sm-4">
        <Card className="text-center mb-2 mb-sm-0" body>
          <CardTitle tag="h5">Visits</CardTitle>
          <CardText tag="h2">?</CardText>
        </Card>
      </div>
      <div className="col-sm-4">
        <Card className="text-center mb-2 mb-sm-0" body>
          <CardTitle tag="h5">Short URLs</CardTitle>
          <CardText tag="h2">
            {loading && !error && 'Loading...'}
            {error && !loading && 'Failed :('}
            {!error && !loading && prettify(shortUrls?.pagination.totalItems ?? 0)}
          </CardText>
        </Card>
      </div>
      <div className="col-sm-4">
        <Card className="text-center" body>
          <CardTitle tag="h5">Tags</CardTitle>
          <CardText tag="h2">{loadingTags ? 'Loading... ' : prettify(tagsList.tags.length)}</CardText>
        </Card>
      </div>
    </div>
  );
};
