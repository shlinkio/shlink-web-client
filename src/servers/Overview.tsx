import { FC, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardText, CardTitle } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import { ShortUrlsListParams } from '../short-urls/reducers/shortUrlsListParams';
import { ShortUrlsList as ShortUrlsListState } from '../short-urls/reducers/shortUrlsList';
import { prettify } from '../utils/helpers/numbers';
import { TagsList } from '../tags/reducers/tagsList';
import { ShortUrlsTableProps } from '../short-urls/ShortUrlsTable';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { CreateShortUrlProps } from '../short-urls/CreateShortUrl';
import { VisitsOverview } from '../visits/reducers/visitsOverview';
import { Versions } from '../utils/helpers/version';
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

export const Overview = (
  ShortUrlsTable: FC<ShortUrlsTableProps>,
  CreateShortUrl: FC<CreateShortUrlProps>,
  ForServerVersion: FC<Versions>,
) => boundToMercureHub(({
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
  const serverId = isServerWithId(selectedServer) ? selectedServer.id : '';
  const history = useHistory();

  useEffect(() => {
    listShortUrls({ itemsPerPage: 5, orderBy: { dateCreated: 'DESC' } });
    listTags();
    loadVisitsOverview();
  }, []);

  return (
    <>
      <div className="row mb-3">
        <div className="col-md-6 col-lg-4">
          <Card className="overview__card mb-2" body>
            <CardTitle tag="h5" className="overview__card-title">Visits</CardTitle>
            <CardText tag="h2">
              <ForServerVersion minVersion="2.2.0">
                {loadingVisits ? 'Loading...' : prettify(visitsCount)}
              </ForServerVersion>
              <ForServerVersion maxVersion="2.1.*">
                <small className="text-muted"><i>Shlink 2.2 is needed</i></small>
              </ForServerVersion>
            </CardText>
          </Card>
        </div>
        <div className="col-md-6 col-lg-4">
          <Card className="overview__card mb-2" body>
            <CardTitle tag="h5" className="overview__card-title">Short URLs</CardTitle>
            <CardText tag="h2">
              {loading ? 'Loading...' : prettify(shortUrls?.pagination.totalItems ?? 0)}
            </CardText>
          </Card>
        </div>
        <div className="col-md-12 col-lg-4">
          <Card className="overview__card mb-2" body>
            <CardTitle tag="h5" className="overview__card-title">Tags</CardTitle>
            <CardText tag="h2">{loadingTags ? 'Loading...' : prettify(tagsList.tags.length)}</CardText>
          </Card>
        </div>
      </div>
      <Card className="mb-4">
        <CardHeader>
          <span className="d-sm-none">Create a short URL</span>
          <h5 className="d-none d-sm-inline">Create a short URL</h5>
          <Link className="float-right" to={`/server/${serverId}/create-short-url`}>Advanced options &raquo;</Link>
        </CardHeader>
        <CardBody>
          <CreateShortUrl basicMode />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <span className="d-sm-none">Recently created URLs</span>
          <h5 className="d-none d-sm-inline">Recently created URLs</h5>
          <Link className="float-right" to={`/server/${serverId}/list-short-urls/1`}>See all &raquo;</Link>
        </CardHeader>
        <CardBody>
          <ShortUrlsTable
            shortUrlsList={shortUrlsList}
            selectedServer={selectedServer}
            className="mb-0"
            refreshList={({ tags }) => tags?.[0] && history.push(`/server/${serverId}/list-short-urls/1?tag=${tags[0]}`)}
          />
        </CardBody>
      </Card>
    </>
  );
}, () => 'https://shlink.io/new-visit');
