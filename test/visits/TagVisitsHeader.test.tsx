import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import Tag from '../../src/tags/helpers/Tag';
import TagVisitsHeader from '../../src/visits/TagVisitsHeader';
import { TagVisits } from '../../src/visits/reducers/tagVisits';
import ColorGenerator from '../../src/utils/services/ColorGenerator';

describe('<TagVisitsHeader />', () => {
  let wrapper: ShallowWrapper;
  const tagVisits = Mock.of<TagVisits>({
    tag: 'foo',
    visits: [{}, {}, {}],
  });
  const goBack = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <TagVisitsHeader tagVisits={tagVisits} goBack={goBack} colorGenerator={Mock.all<ColorGenerator>()} />,
    );
  });
  afterEach(() => wrapper.unmount());

  it('shows expected visits', () => {
    expect(wrapper.prop('visits')).toEqual(tagVisits.visits);
  });

  it('shows title for tag', () => {
    const title = shallow(wrapper.prop('title'));
    const tag = title.find(Tag).first();

    expect(tag.prop('text')).toEqual(tagVisits.tag);

    title.unmount();
  });
});
