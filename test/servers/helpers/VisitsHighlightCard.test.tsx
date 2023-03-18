import { screen, waitFor } from '@testing-library/react';
import type { VisitsHighlightCardProps } from '../../../src/servers/helpers/VisitsHighlightCard';
import { VisitsHighlightCard } from '../../../src/servers/helpers/VisitsHighlightCard';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<VisitsHighlightCard />', () => {
  const setUp = (props: Partial<VisitsHighlightCardProps> = {}) => renderWithEvents(
    <VisitsHighlightCard loading={false} visitsSummary={{ total: 0 }} excludeBots={false} title="" {...props} />,
  );

  it.each([
    [true, () => expect(screen.getByText('Loading...')).toBeInTheDocument()],
    [false, () => expect(screen.queryByText('Loading...')).not.toBeInTheDocument()],
  ])('displays loading message on loading', (loading, assert) => {
    setUp({ loading });
    assert();
  });

  it('does not render tooltip when summary has no bots', async () => {
    const { user } = setUp({ title: 'Foo' });

    await user.hover(screen.getByText('Foo'));
    await waitFor(() => expect(screen.queryByText(/potential bot visits$/)).not.toBeInTheDocument());
  });

  it('renders tooltip when summary has bots', async () => {
    const { user } = setUp({
      title: 'Foo',
      visitsSummary: { total: 50, bots: 30 },
    });

    await user.hover(screen.getByText('Foo'));
    await waitFor(() => expect(screen.getByText(/potential bot visits$/)).toBeInTheDocument());
  });

  it.each([
    [true, 20, () => {
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.queryByText('50')).not.toBeInTheDocument();
    }],
    [true, undefined, () => {
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.queryByText('20')).not.toBeInTheDocument();
    }],
    [false, 20, () => {
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.queryByText('20')).not.toBeInTheDocument();
    }],
    [false, undefined, () => {
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.queryByText('20')).not.toBeInTheDocument();
    }],
  ])('displays non-bots when present and bots are excluded', (excludeBots, nonBots, assert) => {
    setUp({
      excludeBots,
      visitsSummary: { total: 50, nonBots },
    });
    assert();
  });
});
