import { screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { HighlightCardProps } from '../../../src/overview/helpers/HighlightCard';
import { HighlightCard } from '../../../src/overview/helpers/HighlightCard';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<HighlightCard />', () => {
  const setUp = (props: HighlightCardProps & { children?: ReactNode }) => renderWithEvents(
    <MemoryRouter>
      <HighlightCard {...props} />
    </MemoryRouter>,
  );

  it.each([
    [undefined],
    [''],
  ])('does not render icon when there is no link', (link) => {
    setUp({ title: 'foo', link });

    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it.each([
    ['foo'],
    ['bar'],
    ['baz'],
  ])('renders provided title', (title) => {
    setUp({ title });
    expect(screen.getByText(title)).toHaveClass('highlight-card__title');
  });

  it.each([
    ['foo'],
    ['bar'],
    ['baz'],
  ])('renders provided children', (children) => {
    setUp({ title: 'title', children });
    expect(screen.getByText(children)).toHaveClass('card-text');
  });

  it.each([
    ['foo'],
    ['bar'],
    ['baz'],
  ])('adds extra props when a link is provided', (link) => {
    setUp({ title: 'title', link });

    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', `/${link}`);
  });

  it('renders tooltip when provided', async () => {
    const { user } = setUp({ title: 'title', children: 'Foo', tooltip: 'This is the tooltip' });

    await user.hover(screen.getByText('Foo'));
    await waitFor(() => expect(screen.getByText('This is the tooltip')).toBeInTheDocument());
  });
});
