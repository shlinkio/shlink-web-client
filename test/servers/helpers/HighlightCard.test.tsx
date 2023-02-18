import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { HighlightCardProps } from '../../../src/servers/helpers/HighlightCard';
import { HighlightCard } from '../../../src/servers/helpers/HighlightCard';

describe('<HighlightCard />', () => {
  const setUp = (props: HighlightCardProps & { children?: ReactNode }) => render(
    <MemoryRouter>
      <HighlightCard {...props} />
    </MemoryRouter>,
  );

  it.each([
    [undefined],
    [false],
  ])('does not render icon when there is no link', (link) => {
    setUp({ title: 'foo', link: link as undefined | false });

    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it.each([
    ['foo'],
    ['bar'],
    ['baz'],
  ])('renders provided title', (title) => {
    setUp({ title });
    expect(screen.getByText(title)).toHaveAttribute('class', expect.stringContaining('highlight-card__title'));
  });

  it.each([
    ['foo'],
    ['bar'],
    ['baz'],
  ])('renders provided children', (children) => {
    setUp({ title: 'title', children });
    expect(screen.getByText(children)).toHaveAttribute('class', expect.stringContaining('card-text'));
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
});
