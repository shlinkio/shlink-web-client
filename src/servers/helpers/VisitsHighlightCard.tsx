import type { FC } from 'react';
import type { PartialVisitsSummary } from '../../shlink-web-component/visits/reducers/visitsOverview';
import { prettify } from '../../utils/helpers/numbers';
import type { HighlightCardProps } from './HighlightCard';
import { HighlightCard } from './HighlightCard';

export type VisitsHighlightCardProps = Omit<HighlightCardProps, 'tooltip' | 'children'> & {
  loading: boolean;
  excludeBots: boolean;
  visitsSummary: PartialVisitsSummary;
};

export const VisitsHighlightCard: FC<VisitsHighlightCardProps> = ({ loading, excludeBots, visitsSummary, ...rest }) => (
  <HighlightCard
    tooltip={
      visitsSummary.bots !== undefined
        ? <>{excludeBots ? 'Plus' : 'Including'} <b>{prettify(visitsSummary.bots)}</b> potential bot visits</>
        : undefined
    }
    {...rest}
  >
    {loading ? 'Loading...' : prettify(
      excludeBots && visitsSummary.nonBots ? visitsSummary.nonBots : visitsSummary.total,
    )}
  </HighlightCard>
);
