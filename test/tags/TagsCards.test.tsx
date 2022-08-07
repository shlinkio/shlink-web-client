import { screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { TagsCards as createTagsCards } from '../../src/tags/TagsCards';
import { SelectedServer } from '../../src/servers/data';
import { rangeOf } from '../../src/utils/utils';
import { NormalizedTag } from '../../src/tags/data';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<TagsCards />', () => {
  const amountOfTags = 10;
  const sortedTags = rangeOf(amountOfTags, (i) => Mock.of<NormalizedTag>({ tag: `tag_${i}` }));
  const TagsCards = createTagsCards(() => <span>TagCard</span>);
  const setUp = () => renderWithEvents(
    <TagsCards sortedTags={sortedTags} selectedServer={Mock.all<SelectedServer>()} />,
  );

  it('renders the proper amount of groups and cards based on the amount of tags', () => {
    const { container } = setUp();
    const amountOfGroups = 4;
    const cards = screen.getAllByText('TagCard');
    const groups = container.querySelectorAll('.col-md-6');

    expect(cards).toHaveLength(amountOfTags);
    expect(groups).toHaveLength(amountOfGroups);
  });
});
