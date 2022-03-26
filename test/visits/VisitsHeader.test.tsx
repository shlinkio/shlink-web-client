import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import VisitsHeader from '../../src/visits/VisitsHeader';
import { Visit } from '../../src/visits/types';

describe('<VisitsHeader />', () => {
  let wrapper: ShallowWrapper;
  const visits = [Mock.all<Visit>(), Mock.all<Visit>(), Mock.all<Visit>()];
  const title = 'My header title';
  const goBack = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <VisitsHeader visits={visits} goBack={goBack} title={title} />,
    );
  });

  afterEach(() => wrapper.unmount());
  afterEach(jest.resetAllMocks);

  it('shows the amount of visits', () => {
    const visitsBadge = wrapper.find('.badge');

    expect(visitsBadge.html()).toContain(
      `Visits: <span><strong class="short-url-visits-count__amount">${visits.length}</strong></span>`,
    );
  });

  it('shows the title in two places', () => {
    const titles = wrapper.find('.text-center');

    expect(titles).toHaveLength(2);
    expect(titles.at(0).html()).toContain(title);
    expect(titles.at(1).html()).toContain(title);
  });
});
