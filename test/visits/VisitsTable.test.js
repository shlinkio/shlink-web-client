import React from 'react';
import { shallow } from 'enzyme';
import VisitsTable from '../../src/visits/VisitsTable';
import { rangeOf } from '../../src/utils/utils';
import SimplePaginator from '../../src/common/SimplePaginator';
import SearchField from '../../src/utils/SearchField';

describe('<VisitsTable />', () => {
  const matchMedia = () => ({ matches: false });
  let wrapper;
  const createWrapper = (visits) => {
    wrapper = shallow(<VisitsTable visits={visits} matchMedia={matchMedia} />);

    return wrapper;
  };

  afterEach(() => wrapper && wrapper.unmount());

  it('renders columns as expected', () => {
    const wrapper = createWrapper([]);
    const th = wrapper.find('thead').find('th');

    expect(th).toHaveLength(7);
    expect(th.at(1).text()).toContain('Date');
    expect(th.at(2).text()).toContain('Country');
    expect(th.at(3).text()).toContain('City');
    expect(th.at(4).text()).toContain('Browser');
    expect(th.at(5).text()).toContain('OS');
    expect(th.at(6).text()).toContain('Referrer');
  });

  it('shows warning when no visits are found', () => {
    const wrapper = createWrapper([]);
    const td = wrapper.find('tbody').find('td');

    expect(td).toHaveLength(1);
    expect(td.text()).toContain('No visits found with current filtering');
  });

  it.each([
    [ 50, 3 ],
    [ 21, 2 ],
    [ 30, 2 ],
    [ 60, 3 ],
    [ 115, 6 ],
  ])('renders the expected amount of pages', (visitsCount, expectedAmountOfPages) => {
    const wrapper = createWrapper(rangeOf(visitsCount, () => ({ userAgent: '', date: '', referer: '' })));
    const tr = wrapper.find('tbody').find('tr');
    const paginator = wrapper.find(SimplePaginator);

    expect(tr).toHaveLength(20);
    expect(paginator.prop('pagesCount')).toEqual(expectedAmountOfPages);
  });

  it.each(
    rangeOf(20, (value) => [ value ])
  )('does not render footer when there is only one page to render', (visitsCount) => {
    const wrapper = createWrapper(rangeOf(visitsCount, () => ({ userAgent: '', date: '', referer: '' })));
    const tr = wrapper.find('tbody').find('tr');
    const paginator = wrapper.find(SimplePaginator);

    expect(tr).toHaveLength(visitsCount);
    expect(paginator).toHaveLength(0);
  });

  it('selects a row when clicked', () => {
    const wrapper = createWrapper(rangeOf(10, () => ({ userAgent: '', date: '', referer: '' })));

    expect(wrapper.find('.text-primary')).toHaveLength(0);
    expect(wrapper.find('.table-primary')).toHaveLength(0);
    wrapper.find('tr').at(5).simulate('click');
    expect(wrapper.find('.text-primary')).toHaveLength(2);
    expect(wrapper.find('.table-primary')).toHaveLength(1);
    wrapper.find('tr').at(3).simulate('click');
    expect(wrapper.find('.text-primary')).toHaveLength(2);
    expect(wrapper.find('.table-primary')).toHaveLength(1);
    wrapper.find('tr').at(3).simulate('click');
    expect(wrapper.find('.text-primary')).toHaveLength(0);
    expect(wrapper.find('.table-primary')).toHaveLength(0);
  });

  it('orders visits when column is clicked', () => {
    const wrapper = createWrapper(rangeOf(9, (index) => ({
      userAgent: '',
      date: `${9 - index}`,
      referer: `${index}`,
      visitLocation: {
        countryName: `Country_${index}`,
      },
    })));

    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(2).text()).toContain('Country_1');
    wrapper.find('thead').find('th').at(1).simulate('click'); // Date column ASC
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(2).text()).toContain('Country_9');
    wrapper.find('thead').find('th').at(6).simulate('click'); // Referer column - ASC
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(2).text()).toContain('Country_1');
    wrapper.find('thead').find('th').at(6).simulate('click'); // Referer column - DESC
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(2).text()).toContain('Country_9');
    wrapper.find('thead').find('th').at(6).simulate('click'); // Referer column - reset
    expect(wrapper.find('tbody').find('tr').at(0).find('td').at(2).text()).toContain('Country_1');
  });

  it('filters list when writing in search box', () => {
    const wrapper = createWrapper([
      ...rangeOf(7, () => ({ userAgent: 'aaa', date: 'aaa', referer: 'aaa' })),
      ...rangeOf(2, () => ({ userAgent: 'bbb', date: 'bbb', referer: 'bbb' })),
    ]);
    const searchField = wrapper.find(SearchField);

    expect(wrapper.find('tbody').find('tr')).toHaveLength(7 + 2);
    searchField.simulate('change', 'aa');
    expect(wrapper.find('tbody').find('tr')).toHaveLength(7);
    searchField.simulate('change', 'bb');
    expect(wrapper.find('tbody').find('tr')).toHaveLength(2);
    searchField.simulate('change', '');
    expect(wrapper.find('tbody').find('tr')).toHaveLength(7 + 2);
  });
});
