import type { FC } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Row } from 'reactstrap';
import { prettify } from '../../src/utils/helpers/numbers';
import type { ShlinkShortUrlsListParams } from '../api-contract';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
import type { CreateShortUrlProps } from '../short-urls/CreateShortUrl';
import type { ShortUrlsList as ShortUrlsListState } from '../short-urls/reducers/shortUrlsList';
import { ITEMS_IN_OVERVIEW_PAGE } from '../short-urls/reducers/shortUrlsList';
import type { ShortUrlsTableType } from '../short-urls/ShortUrlsTable';
import type { TagsList } from '../tags/reducers/tagsList';
import { useRoutesPrefix } from '../utils/routesPrefix';
import { useSetting } from '../utils/settings';
import type { VisitsOverview } from '../visits/reducers/visitsOverview';
import { HighlightCard } from './helpers/HighlightCard';
import { VisitsHighlightCard } from './helpers/VisitsHighlightCard';

interface OverviewConnectProps {
  shortUrlsList: ShortUrlsListState;
  listShortUrls: (params: ShlinkShortUrlsListParams) => void;
  listTags: Function;
  tagsList: TagsList;
  visitsOverview: VisitsOverview;
  loadVisitsOverview: Function;
}

export const Overview = (
  ShortUrlsTable: ShortUrlsTableType,
  CreateShortUrl: FC<CreateShortUrlProps>,
) => boundToMercureHub(({
  shortUrlsList,
  listShortUrls,
  listTags,
  tagsList,
  loadVisitsOverview,
  visitsOverview,
}: OverviewConnectProps) => {
  const { loading, shortUrls } = shortUrlsList;
  const { loading: loadingTags } = tagsList;
  const { loading: loadingVisits, nonOrphanVisits, orphanVisits } = visitsOverview;
  const routesPrefix = useRoutesPrefix();
  const navigate = useNavigate();
  const visits = useSetting('visits');

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
            link={`${routesPrefix}/non-orphan-visits`}
            excludeBots={visits?.excludeBots ?? false}
            loading={loadingVisits}
            visitsSummary={nonOrphanVisits}
          />
        </div>
        <div className="col-lg-6 col-xl-3 mb-3">
          <VisitsHighlightCard
            title="Orphan visits"
            link={`${routesPrefix}/orphan-visits`}
            excludeBots={visits?.excludeBots ?? false}
            loading={loadingVisits}
            visitsSummary={orphanVisits}
          />
        </div>
        <div className="col-lg-6 col-xl-3 mb-3">
          <HighlightCard title="Short URLs" link={`${routesPrefix}/list-short-urls/1`}>
            {loading ? 'Loading...' : prettify(shortUrls?.pagination.totalItems ?? 0)}
          </HighlightCard>
        </div>
        <div className="col-lg-6 col-xl-3 mb-3">
          <HighlightCard title="Tags" link={`${routesPrefix}/manage-tags`}>
            {loadingTags ? 'Loading...' : prettify(tagsList.tags.length)}
          </HighlightCard>
        </div>
      </Row>

      <Card className="mb-3">
        <CardHeader>
          <span className="d-sm-none">Create a short URL</span>
          <h5 className="d-none d-sm-inline">Create a short URL</h5>
          <Link className="float-end" to={`${routesPrefix}/create-short-url`}>Advanced options &raquo;</Link>
        </CardHeader>
        <CardBody>
          <CreateShortUrl basicMode />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <span className="d-sm-none">Recently created URLs</span>
          <h5 className="d-none d-sm-inline">Recently created URLs</h5>
          <Link className="float-end" to={`${routesPrefix}/list-short-urls/1`}>See all &raquo;</Link>
        </CardHeader>
        <CardBody>
          <ShortUrlsTable
            shortUrlsList={shortUrlsList}
            className="mb-0"
            onTagClick={(tag) => navigate(`${routesPrefix}/list-short-urls/1?tags=${encodeURIComponent(tag)}`)}
          />
        </CardBody>
      </Card>
    </>
  );
}, () => [Topics.visits, Topics.orphanVisits]);
