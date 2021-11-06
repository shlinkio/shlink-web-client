import { FC, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardText, CardTitle, Row } from 'reactstrap';
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
import { Topics } from '../mercure/helpers/Topics';
import { getServerId, SelectedServer } from './data';
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
  const { loading: loadingVisits, visitsCount, orphanVisitsCount } = visitsOverview;
  const serverId = getServerId(selectedServer);
  const history = useHistory();

  useEffect(() => {
    listShortUrls({ itemsPerPage: 5, orderBy: { dateCreated: 'DESC' } });
    listTags();
    loadVisitsOverview();
  }, []);

  return (
    <>
      <Row>
        <div className="col-md-6 col-xl-3">
          <Card className="overview__card mb-3" body>
            <CardTitle tag="h5" className="overview__card-title">Visits</CardTitle>
            <CardText tag="h2">{loadingVisits ? 'Loading...' : prettify(visitsCount)}</CardText>
          </Card>
        </div>
        <div className="col-md-6 col-xl-3">
          <Card className="overview__card mb-3" body tag={Link} to={`/server/${serverId}/orphan-visits`}>
            <CardTitle tag="h5" className="overview__card-title">Orphan visits</CardTitle>
            <CardText tag="h2">
              <ForServerVersion minVersion="2.6.0">
                {loadingVisits ? 'Loading...' : prettify(orphanVisitsCount ?? 0)}
              </ForServerVersion>
              <ForServerVersion maxVersion="2.5.*">
                <small className="text-muted"><i>Shlink 2.6 is needed</i></small>
              </ForServerVersion>
            </CardText>
          </Card>
        </div>
        <div className="col-md-6 col-xl-3">
          <Card className="overview__card mb-3" body tag={Link} to={`/server/${serverId}/list-short-urls/1`}>
            <CardTitle tag="h5" className="overview__card-title">Short URLs</CardTitle>
            <CardText tag="h2">
              {loading ? 'Loading...' : prettify(shortUrls?.pagination.totalItems ?? 0)}
            </CardText>
          </Card>
        </div>
        <div className="col-md-6 col-xl-3">
          <Card className="overview__card mb-3" body tag={Link} to={`/server/${serverId}/manage-tags`}>
            <CardTitle tag="h5" className="overview__card-title">Tags</CardTitle>
            <CardText tag="h2">{loadingTags ? 'Loading...' : prettify(tagsList.tags.length)}</CardText>
          </Card>
        </div>
      </Row>
      <Card className="mb-3">
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
            onTagClick={(tag) => history.push(`/server/${serverId}/list-short-urls/1?tag=${tag}`)}
          />
        </CardBody>
      </Card>
    </>
  );
}, () => [ Topics.visits, Topics.orphanVisits ]);
