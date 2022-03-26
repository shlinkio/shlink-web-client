import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import VisitsTable, { VisitsTableProps } from '../../src/visits/VisitsTable';
import { rangeOf } from '../../src/utils/utils';
import SimplePaginator from '../../src/common/SimplePaginator';
import SearchField from '../../src/utils/SearchField';
import { NormalizedVisit } from '../../src/visits/types';
import { ReachableServer, SelectedServer } from '../../src/servers/data';
import { SemVer } from '../../src/utils/helpers/version';

describe('<VisitsTable />', () => {
  const matchMedia = () => Mock.of<MediaQueryList>({ matches: false });
  const setSelectedVisits = jest.fn();
  let wrapper: ShallowWrapper;
  const wrapperFactory = (props: Partial<VisitsTableProps> = {}) => {
    wrapper = shallow(
      <VisitsTable
        visits={[]}
        selectedServer={Mock.all<SelectedServer>()}
        {...props}
        matchMedia={matchMedia}
        setSelectedVisits={setSelectedVisits}
      />,
    );

    return wrapper;
  };
  const createWrapper = (visits: NormalizedVisit[], selectedVisits: NormalizedVisit[] = []) => wrapperFactory(
    { visits, selectedVisits },
  );
  const createOrphanVisitsWrapper = (isOrphanVisits: boolean, version: SemVer) => wrapperFactory({
    isOrphanVisits,
    selectedServer: Mock.of<ReachableServer>({ printableVersion: version, version }),
  });
  const createServerVersionWrapper = (version: SemVer) => wrapperFactory({
    selectedServer: Mock.of<ReachableServer>({ printableVersion: version, version }),
  });
  const createWrapperWithBots = () => wrapperFactory({
    selectedServer: Mock.of<ReachableServer>({ printableVersion: '2.7.0', version: '2.7.0' }),
    visits: [
      Mock.of<NormalizedVisit>({ potentialBot: false }),
      Mock.of<NormalizedVisit>({ potentialBot: true }),
    ],
  });

  afterEach(jest.resetAllMocks);
  afterEach(() => wrapper?.unmount());

  it.each([
    ['2.6.0' as SemVer, ['Date', 'Country', 'City', 'Browser', 'OS', 'Referrer']],
    ['2.7.0' as SemVer, ['fa-robot', 'Date', 'Country', 'City', 'Browser', 'OS', 'Referrer']],
  ])('renders columns as expected', (version, expectedColumns) => {
    const wrapper = createServerVersionWrapper(version);
    const th = wrapper.find('thead').find('th');

    expect(th).toHaveLength(expectedColumns.length + 1);
    expectedColumns.forEach((column, index) => {
      expect(th.at(index + 1).html()).toContain(column);
    });
  });

  it('shows warning when no visits are found', () => {
    const wrapper = createWrapper([]);
    const td = wrapper.find('tbody').find('td');

    expect(td).toHaveLength(1);
    expect(td.text()).toContain('No visits found with current filtering');
  });

  it.each([
    [50, 3],
    [21, 2],
    [30, 2],
    [60, 3],
    [115, 6],
  ])('renders the expected amount of pages', (visitsCount, expectedAmountOfPages) => {
    const wrapper = createWrapper(
      rangeOf(visitsCount, () => Mock.of<NormalizedVisit>({ browser: '', date: '', referer: '' })),
    );
    const tr = wrapper.find('tbody').find('tr');
    const paginator = wrapper.find(SimplePaginator);

    expect(tr).toHaveLength(20);
    expect(paginator.prop('pagesCount')).toEqual(expectedAmountOfPages);
  });

  it.each(
    rangeOf(20, (value) => [value]),
  )('does not render footer when there is only one page to render', (visitsCount) => {
    const wrapper = createWrapper(
      rangeOf(visitsCount, () => Mock.of<NormalizedVisit>({ browser: '', date: '', referer: '' })),
    );
    const tr = wrapper.find('tbody').find('tr');
    const paginator = wrapper.find(SimplePaginator);

    expect(tr).toHaveLength(visitsCount);
    expect(paginator).toHaveLength(0);
  });

  it('selected rows are highlighted', () => {
    const visits = rangeOf(10, () => Mock.of<NormalizedVisit>({ browser: '', date: '', referer: '' }));
    const wrapper = createWrapper(
      visits,
      [visits[1], visits[2]],
    );

    expect(wrapper.find('.text-primary')).toHaveLength(3);
    expect(wrapper.find('.table-active')).toHaveLength(2);

    // Select one extra
    wrapper.find('tr').at(5).simulate('click');
    expect(setSelectedVisits).toHaveBeenCalledWith([visits[1], visits[2], visits[4]]);

    // Deselect one
    wrapper.find('tr').at(3).simulate('click');
    expect(setSelectedVisits).toHaveBeenCalledWith([visits[1]]);

    // Select all
    wrapper.find('thead').find('th').at(0).simulate('click');
    expect(setSelectedVisits).toHaveBeenCalledWith(visits);
  });

  it('orders visits when column is clicked', () => {
    const wrapper = createWrapper(rangeOf(9, (index) => Mock.of<NormalizedVisit>({
      browser: '',
      date: `${9 - index}`,
      referer: `${index}`,
      country: `Country_${index}`,
    })));

    expect(wrapper.find('tbody').find('tr').at(0).find('td')
      .at(2)
      .text()).toContain('Country_1');
    wrapper.find('thead').find('th').at(1).simulate('click'); // Date column ASC
    expect(wrapper.find('tbody').find('tr').at(0).find('td')
      .at(2)
      .text()).toContain('Country_9');
    wrapper.find('thead').find('th').at(6).simulate('click'); // Referer column - ASC
    expect(wrapper.find('tbody').find('tr').at(0).find('td')
      .at(2)
      .text()).toContain('Country_1');
    wrapper.find('thead').find('th').at(6).simulate('click'); // Referer column - DESC
    expect(wrapper.find('tbody').find('tr').at(0).find('td')
      .at(2)
      .text()).toContain('Country_9');
    wrapper.find('thead').find('th').at(6).simulate('click'); // Referer column - reset
    expect(wrapper.find('tbody').find('tr').at(0).find('td')
      .at(2)
      .text()).toContain('Country_1');
  });

  it('filters list when writing in search box', () => {
    const wrapper = createWrapper([
      ...rangeOf(7, () => Mock.of<NormalizedVisit>({ browser: 'aaa', date: 'aaa', referer: 'aaa' })),
      ...rangeOf(2, () => Mock.of<NormalizedVisit>({ browser: 'bbb', date: 'bbb', referer: 'bbb' })),
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

  it.each([
    [true, '2.6.0' as SemVer, 8],
    [false, '2.6.0' as SemVer, 7],
    [true, '2.7.0' as SemVer, 9],
    [false, '2.7.0' as SemVer, 8],
  ])('displays proper amount of columns for orphan and non-orphan visits', (isOrphanVisits, version, expectedCols) => {
    const wrapper = createOrphanVisitsWrapper(isOrphanVisits, version);
    const rowsWithColspan = wrapper.find('[colSpan]');
    const cols = wrapper.find('th');

    expect(cols).toHaveLength(expectedCols);
    expect(rowsWithColspan).toHaveLength(2);
    rowsWithColspan.forEach((row) => expect(row.prop('colSpan')).toEqual(expectedCols));
  });

  it('displays bots icon when a visit is a potential bot', () => {
    const wrapper = createWrapperWithBots();
    const rows = wrapper.find('tbody').find('tr');

    expect(rows.at(0).find('td').at(1).text()).not.toContain('FontAwesomeIcon');
    expect(rows.at(1).find('td').at(1).text()).toContain('FontAwesomeIcon');
  });
});
