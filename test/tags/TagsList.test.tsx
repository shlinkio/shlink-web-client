import { screen, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { identity } from 'ramda';
import type { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import type { TagsList } from '../../src/tags/reducers/tagsList';
import type { TagsListProps } from '../../src/tags/TagsList';
import { TagsList as createTagsList } from '../../src/tags/TagsList';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<TagsList />', () => {
  const filterTags = jest.fn();
  const TagsListComp = createTagsList(({ sortedTags }) => <>TagsTable ({sortedTags.map((t) => t.visits).join(',')})</>);
  const setUp = (tagsList: Partial<TagsList>, excludeBots = false) => renderWithEvents(
    <TagsListComp
      {...fromPartial<TagsListProps>({})}
      {...fromPartial<MercureBoundProps>({ mercureInfo: {} })}
      forceListTags={identity}
      filterTags={filterTags}
      tagsList={fromPartial(tagsList)}
      settings={fromPartial({ visits: { excludeBots } })}
    />,
  );

  afterEach(jest.clearAllMocks);

  it('shows a loading message when tags are being loaded', () => {
    setUp({ loading: true });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Error loading tags :(')).not.toBeInTheDocument();
  });

  it('shows an error when tags failed to be loaded', () => {
    setUp({ error: true });

    expect(screen.getByText('Error loading tags :(')).toBeInTheDocument();
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });

  it('shows a message when the list of tags is empty', () => {
    setUp({ filteredTags: [] });

    expect(screen.getByText('No tags found')).toBeInTheDocument();
    expect(screen.queryByText('Error loading tags :(')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });

  it('triggers tags filtering when search field changes', async () => {
    const { user } = setUp({ filteredTags: [] });

    expect(filterTags).not.toHaveBeenCalled();
    await user.type(screen.getByPlaceholderText('Search...'), 'Hello');
    await waitFor(() => expect(filterTags).toHaveBeenCalledTimes(1));
  });

  it.each([
    [false, undefined, '25,25,25'],
    [true, undefined, '25,25,25'],
    [
      false,
      {
        total: 20,
        nonBots: 15,
        bots: 5,
      },
      '20,20,20',
    ],
    [
      true,
      {
        total: 20,
        nonBots: 15,
        bots: 5,
      },
      '15,15,15',
    ],
  ])('displays proper amount of visits', (excludeBots, visitsSummary, expectedAmounts) => {
    setUp({
      filteredTags: ['foo', 'bar', 'baz'],
      stats: {
        foo: {
          visitsSummary,
          visitsCount: 25,
          shortUrlsCount: 1,
        },
        bar: {
          visitsSummary,
          visitsCount: 25,
          shortUrlsCount: 1,
        },
        baz: {
          visitsSummary,
          visitsCount: 25,
          shortUrlsCount: 1,
        },
      },
    }, excludeBots);
    expect(screen.getByText(`TagsTable (${expectedAmounts})`)).toBeInTheDocument();
  });
});
