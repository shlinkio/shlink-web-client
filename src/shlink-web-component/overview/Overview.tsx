import type { FC } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Row } from 'reactstrap';
import type { ShlinkShortUrlsListParams } from '../../api/types';
import { boundToMercureHub } from '../../mercure/helpers/boundToMercureHub';
import { Topics } from '../../mercure/helpers/Topics';
import type { SelectedServer } from '../../servers/data';
import { getServerId } from '../../servers/data';
import { HighlightCard } from '../../servers/helpers/HighlightCard';
import { VisitsHighlightCard } from '../../servers/helpers/VisitsHighlightCard';
import type { Settings } from '../../settings/reducers/settings';
import { prettify } from '../../utils/helpers/numbers';
import type { CreateShortUrlProps } from '../short-urls/CreateShortUrl';
import type { ShortUrlsList as ShortUrlsListState } from '../short-urls/reducers/shortUrlsList';
import { ITEMS_IN_OVERVIEW_PAGE } from '../short-urls/reducers/shortUrlsList';
import type { ShortUrlsTableType } from '../short-urls/ShortUrlsTable';
import type { TagsList } from '../tags/reducers/tagsList';
import { useFeature } from '../utils/features';
import type { VisitsOverview } from '../visits/reducers/visitsOverview';

interface OverviewConnectProps {
  shortUrlsList: ShortUrlsListState;
  listShortUrls: (params: ShlinkShortUrlsListParams) => void;
  listTags: Function;
  tagsList: TagsList;
  selectedServer: SelectedServer;
  visitsOverview: VisitsOverview;
  loadVisitsOverview: Function;
  settings: Settings;
}

export const Overview = (
  ShortUrlsTable: ShortUrlsTableType,
  CreateShortUrl: FC<CreateShortUrlProps>,
) => boundToMercureHub(({
  shortUrlsList,
  listShortUrls,
  listTags,
  tagsList,
  selectedServer,
  loadVisitsOverview,
  visitsOverview,
  settings: { visits },
}: OverviewConnectProps) => {
  const { loading, shortUrls } = shortUrlsList;
  const { loading: loadingTags } = tagsList;
  const { loading: loadingVisits, nonOrphanVisits, orphanVisits } = visitsOverview;
  const serverId = getServerId(selectedServer);
  const linkToNonOrphanVisits = useFeature('nonOrphanVisits');
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
          <VisitsHighlightCard
            title="Visits"
            link={linkToNonOrphanVisits ? `/server/${serverId}/non-orphan-visits` : undefined}
            excludeBots={visits?.excludeBots ?? false}
            loading={loadingVisits}
            visitsSummary={nonOrphanVisits}
          />
        </div>
        <div className="col-lg-6 col-xl-3 mb-3">
          <VisitsHighlightCard
            title="Orphan visits"
            link={`/server/${serverId}/orphan-visits`}
            excludeBots={visits?.excludeBots ?? false}
            loading={loadingVisits}
            visitsSummary={orphanVisits}
          />
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
