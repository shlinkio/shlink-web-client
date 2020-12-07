import { FC, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardText, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ShortUrlsListParams } from '../short-urls/reducers/shortUrlsListParams';
import { ShortUrlsList as ShortUrlsListState } from '../short-urls/reducers/shortUrlsList';
import { prettify } from '../utils/helpers/numbers';
import { TagsList } from '../tags/reducers/tagsList';
import { ShortUrlsTableProps } from '../short-urls/ShortUrlsTable';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { VisitsOverview } from '../visits/reducers/visitsOverview';
import { isServerWithId, SelectedServer } from './data';
import './Overview.scss';

interface OverviewConnectProps {
  shortUrlsList: ShortUrlsListState;
  listShortUrls: (params: ShortUrlsListParams) => void;
  listTags: Function;
  tagsList: TagsList;
  selectedServer: SelectedServer;
  visitsOverview: VisitsOverview;
  loadVisitsOverview: Function;
}

export const Overview = (ShortUrlsTable: FC<ShortUrlsTableProps>) => boundToMercureHub(({
  shortUrlsList,
  listShortUrls,
  listTags,
  tagsList,
  selectedServer,
  loadVisitsOverview,
  visitsOverview,
}: OverviewConnectProps) => {
  const { loading, shortUrls } = shortUrlsList;
  const { loading: loadingTags } = tagsList;
  const { loading: loadingVisits, visitsCount } = visitsOverview;
  const serverId = !isServerWithId(selectedServer) ? '' : selectedServer.id;

  useEffect(() => {
    listShortUrls({ itemsPerPage: 5, orderBy: { dateCreated: 'DESC' } });
    listTags();
    loadVisitsOverview();
  }, []);

  return (
    <>
      <div className="row mb-3">
        <div className="col-sm-4">
          <Card className="overview__card mb-2" body>
            <CardTitle tag="h5" className="overview__card-title">Visits</CardTitle>
            <CardText tag="h2">{loadingVisits ? 'Loading...' : prettify(visitsCount)}</CardText>
          </Card>
        </div>
        <div className="col-sm-4">
          <Card className="overview__card mb-2" body>
            <CardTitle tag="h5" className="overview__card-title">Short URLs</CardTitle>
            <CardText tag="h2">
              {loading ? 'Loading...' : prettify(shortUrls?.pagination.totalItems ?? 0)}
            </CardText>
          </Card>
        </div>
        <div className="col-sm-4">
          <Card className="overview__card mb-2" body>
            <CardTitle tag="h5" className="overview__card-title">Tags</CardTitle>
            <CardText tag="h2">{loadingTags ? 'Loading... ' : prettify(tagsList.tags.length)}</CardText>
          </Card>
        </div>
      </div>
      <Card className="mb-4">
        <CardHeader>
          Create short URL
          <Link className="float-right" to={`/server/${serverId}/create-short-url`}>More options &raquo;</Link>
        </CardHeader>
        <CardBody>Create</CardBody>
      </Card>
      <Card>
        <CardHeader>
          Recently created URLs
          <Link className="float-right" to={`/server/${serverId}/list-short-urls/1`}>See all &raquo;</Link>
        </CardHeader>
        <CardBody>
          <ShortUrlsTable shortUrlsList={shortUrlsList} selectedServer={selectedServer} className="mb-0" />
        </CardBody>
      </Card>
    </>
  );
}, () => 'https://shlink.io/new-visit');
