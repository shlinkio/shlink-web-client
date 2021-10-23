import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { TagsCards as createTagsCards } from '../../src/tags/TagsCards';
import { TagsList } from '../../src/tags/reducers/tagsList';
import { SelectedServer } from '../../src/servers/data';
import { rangeOf } from '../../src/utils/utils';

describe('<TagsCards />', () => {
  const amountOfTags = 10;
  const tagsList = Mock.of<TagsList>({ filteredTags: rangeOf(amountOfTags, (i) => `tag_${i}`), stats: {} });
  const TagCard = () => null;
  const TagsCards = createTagsCards(TagCard);
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(<TagsCards tagsList={tagsList} selectedServer={Mock.all<SelectedServer>()} />);
  });

  afterEach(() => wrapper?.unmount());

  it('renders the proper amount of groups and cards based on the amount of tags', () => {
    const amountOfGroups = 4;
    const cards = wrapper.find(TagCard);
    const groups = wrapper.find('.col-md-6');

    expect(cards).toHaveLength(amountOfTags);
    expect(groups).toHaveLength(amountOfGroups);
  });

  it('displays card on toggle', () => {
    const card = () => wrapper.find(TagCard).at(5);

    expect(card().prop('displayed')).toEqual(false);
    (card().prop('toggle') as Function)();
    expect(card().prop('displayed')).toEqual(true);
  });
});
