import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { DomainsList } from '../../src/domains/reducers/domainsList';
import { ManageDomains } from '../../src/domains/ManageDomains';
import Message from '../../src/utils/Message';
import { Result } from '../../src/utils/Result';
import SearchField from '../../src/utils/SearchField';
import { ProblemDetailsError, ShlinkDomain } from '../../src/api/types';
import { ShlinkApiError } from '../../src/api/ShlinkApiError';
import { DomainRow } from '../../src/domains/DomainRow';
import { SelectedServer } from '../../src/servers/data';

describe('<ManageDomains />', () => {
  const listDomains = jest.fn();
  const filterDomains = jest.fn();
  const editDomainRedirects = jest.fn();
  let wrapper: ShallowWrapper;
  const createWrapper = (domainsList: DomainsList) => {
    wrapper = shallow(
      <ManageDomains
        listDomains={listDomains}
        filterDomains={filterDomains}
        editDomainRedirects={editDomainRedirects}
        domainsList={domainsList}
        selectedServer={Mock.all<SelectedServer>()}
      />,
    );

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('shows loading message while domains are loading', () => {
    const wrapper = createWrapper(Mock.of<DomainsList>({ loading: true, filteredDomains: [] }));
    const message = wrapper.find(Message);
    const searchField = wrapper.find(SearchField);
    const result = wrapper.find(Result);
    const apiError = wrapper.find(ShlinkApiError);

    expect(message).toHaveLength(1);
    expect(message.prop('loading')).toEqual(true);
    expect(searchField).toHaveLength(0);
    expect(result).toHaveLength(0);
    expect(apiError).toHaveLength(0);
  });

  it('shows error result when domains loading fails', () => {
    const errorData = Mock.of<ProblemDetailsError>();
    const wrapper = createWrapper(Mock.of<DomainsList>(
      { loading: false, error: true, errorData, filteredDomains: [] },
    ));
    const message = wrapper.find(Message);
    const searchField = wrapper.find(SearchField);
    const result = wrapper.find(Result);
    const apiError = wrapper.find(ShlinkApiError);

    expect(result).toHaveLength(1);
    expect(result.prop('type')).toEqual('error');
    expect(apiError).toHaveLength(1);
    expect(apiError.prop('errorData')).toEqual(errorData);
    expect(searchField).toHaveLength(1);
    expect(message).toHaveLength(0);
  });

  it('filters domains when SearchField changes', () => {
    const wrapper = createWrapper(Mock.of<DomainsList>({ loading: false, error: false, filteredDomains: [] }));
    const searchField = wrapper.find(SearchField);

    expect(filterDomains).not.toHaveBeenCalled();
    searchField.simulate('change');
    expect(filterDomains).toHaveBeenCalledTimes(1);
  });

  it('shows expected headers', () => {
    const wrapper = createWrapper(Mock.of<DomainsList>({ loading: false, error: false, filteredDomains: [] }));
    const headerCells = wrapper.find('th');

    expect(headerCells).toHaveLength(6);
  });

  it('one row when list of domains is empty', () => {
    const wrapper = createWrapper(Mock.of<DomainsList>({ loading: false, error: false, filteredDomains: [] }));
    const tableBody = wrapper.find('tbody');
    const regularRows = tableBody.find('tr');
    const domainRows = tableBody.find(DomainRow);

    expect(regularRows).toHaveLength(1);
    expect(regularRows.html()).toContain('No results found');
    expect(domainRows).toHaveLength(0);
  });

  it('as many DomainRows as domains are provided', () => {
    const filteredDomains = [
      Mock.of<ShlinkDomain>({ domain: 'foo' }),
      Mock.of<ShlinkDomain>({ domain: 'bar' }),
      Mock.of<ShlinkDomain>({ domain: 'baz' }),
    ];
    const wrapper = createWrapper(Mock.of<DomainsList>({ loading: false, error: false, filteredDomains }));
    const tableBody = wrapper.find('tbody');
    const regularRows = tableBody.find('tr');
    const domainRows = tableBody.find(DomainRow);

    expect(regularRows).toHaveLength(0);
    expect(domainRows).toHaveLength(filteredDomains.length);
  });
});
