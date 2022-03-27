import { FC, useEffect } from 'react';
import { Card, CardBody, CardHeader, Row } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ITEMS_IN_OVERVIEW_PAGE, ShortUrlsList as ShortUrlsListState } from '../short-urls/reducers/shortUrlsList';
import { prettify } from '../utils/helpers/numbers';
import { TagsList } from '../tags/reducers/tagsList';
import { ShortUrlsTableProps } from '../short-urls/ShortUrlsTable';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { CreateShortUrlProps } from '../short-urls/CreateShortUrl';
import { VisitsOverview } from '../visits/reducers/visitsOverview';
import { Versions } from '../utils/helpers/version';
import { Topics } from '../mercure/helpers/Topics';
import { ShlinkShortUrlsListParams } from '../api/types';
import { supportsNonOrphanVisits, supportsOrphanVisits } from '../utils/helpers/features';
import { getServerId, SelectedServer } from './data';
import { HighlightCard } from './helpers/HighlightCard';

interface OverviewConnectProps {
  shortUrlsList: ShortUrlsListState;
  listShortUrls: (params: ShlinkShortUrlsListParams) => void;
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
  const linkToOrphanVisits = supportsOrphanVisits(selectedServer);
  const linkToNonOrphanVisits = supportsNonOrphanVisits(selectedServer);
  const navigate = useNavigate();

  useEffect(() => {
    listShortUrls({ itemsPerPage: ITEMS_IN_OVERVIEW_PAGE, orderBy: { field: 'dateCreated', dir: 'DESC' } });
    listTags();
    loadVisitsOverview();
  }, []);

  return (
    <>
      <Row>
        <div className="col-lg-6 col-xl-3 mb-3">
          <HighlightCard title="Visits" link={linkToNonOrphanVisits && `/server/${serverId}/non-orphan-visits`}>
            {loadingVisits ? 'Loading...' : prettify(visitsCount)}
          </HighlightCard>
        </div>
        <div className="col-lg-6 col-xl-3 mb-3">
          <HighlightCard title="Orphan visits" link={linkToOrphanVisits && `/server/${serverId}/orphan-visits`}>
            <ForServerVersion minVersion="2.6.0">
              {loadingVisits ? 'Loading...' : prettify(orphanVisitsCount ?? 0)}
            </ForServerVersion>
            <ForServerVersion maxVersion="2.5.*">
              <small className="text-muted"><i>Shlink 2.6 is needed</i></small>
            </ForServerVersion>
          </HighlightCard>
        </div>
        <div className="col-lg-6 col-xl-3 mb-3">
          <HighlightCard title="Short URLs" link={`/server/${serverId}/list-short-urls/1`}>
            {loading ? 'Loading...' : prettify(shortUrls?.pagination.totalItems ?? 0)}
          </HighlightCard>
        </div>
        <div className="col-lg-6 col-xl-3 mb-3">
          <HighlightCard title="Tags" link={`/server/${serverId}/manage-tags`}>
            {loadingTags ? 'Loading...' : prettify(tagsList.tags.length)}
          </HighlightCard>
        </div>
      </Row>

      <Card className="mb-3">
        <CardHeader>
          <span className="d-sm-none">Create a short URL</span>
          <h5 className="d-none d-sm-inline">Create a short URL</h5>
          <Link className="float-end" to={`/server/${serverId}/create-short-url`}>Advanced options &raquo;</Link>
        </CardHeader>
        <CardBody>
          <CreateShortUrl basicMode />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <span className="d-sm-none">Recently created URLs</span>
          <h5 className="d-none d-sm-inline">Recently created URLs</h5>
          <Link className="float-end" to={`/server/${serverId}/list-short-urls/1`}>See all &raquo;</Link>
        </CardHeader>
        <CardBody>
          <ShortUrlsTable
            shortUrlsList={shortUrlsList}
            selectedServer={selectedServer}
            className="mb-0"
            onTagClick={(tag) => navigate(`/server/${serverId}/list-short-urls/1?tags=${encodeURIComponent(tag)}`)}
          />
        </CardBody>
      </Card>
    </>
  );
}, () => [Topics.visits, Topics.orphanVisits]);
