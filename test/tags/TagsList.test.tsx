import { screen, waitFor } from '@testing-library/react';
import { identity } from 'ramda';
import { Mock } from 'ts-mockery';
import { TagsList as createTagsList, TagsListProps } from '../../src/tags/TagsList';
import { TagsList } from '../../src/tags/reducers/tagsList';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { Settings } from '../../src/settings/reducers/settings';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<TagsList />', () => {
  const filterTags = vi.fn();
  const TagsListComp = createTagsList(() => <>TagsTable</>);
  const setUp = (tagsList: Partial<TagsList>) => renderWithEvents(
    <TagsListComp
      {...Mock.all<TagsListProps>()}
      {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
      forceListTags={identity}
      filterTags={filterTags}
      tagsList={Mock.of<TagsList>(tagsList)}
      settings={Mock.all<Settings>()}
    />,
  );

  afterEach(vi.clearAllMocks);

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
});
