import { screen, waitFor } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { DomainsList } from '../../src/domains/reducers/domainsList';
import { ManageDomains } from '../../src/domains/ManageDomains';
import { ProblemDetailsError, ShlinkDomain } from '../../src/api/types';
import { SelectedServer } from '../../src/servers/data';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<ManageDomains />', () => {
  const listDomains = jest.fn();
  const filterDomains = jest.fn();
  const setUp = (domainsList: DomainsList) => renderWithEvents(
    <ManageDomains
      listDomains={listDomains}
      filterDomains={filterDomains}
      editDomainRedirects={jest.fn()}
      checkDomainHealth={jest.fn()}
      domainsList={domainsList}
      selectedServer={Mock.all<SelectedServer>()}
    />,
  );

  afterEach(jest.clearAllMocks);

  it('shows loading message while domains are loading', () => {
    setUp(Mock.of<DomainsList>({ loading: true, filteredDomains: [] }));

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Error loading domains :(')).not.toBeInTheDocument();
  });

  it.each([
    [undefined, 'Error loading domains :('],
    [Mock.of<ProblemDetailsError>(), 'Error loading domains :('],
    [Mock.of<ProblemDetailsError>({ detail: 'Foo error!!' }), 'Foo error!!'],
  ])('shows error result when domains loading fails', (errorData, expectedErrorMessage) => {
    setUp(Mock.of<DomainsList>({ loading: false, error: true, errorData, filteredDomains: [] }));

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText(expectedErrorMessage)).toBeInTheDocument();
  });

  it('filters domains when SearchField changes', async () => {
    const { user } = setUp(Mock.of<DomainsList>({ loading: false, error: false, filteredDomains: [] }));

    expect(filterDomains).not.toHaveBeenCalled();
    await user.type(screen.getByPlaceholderText('Search...'), 'Foo');
    await waitFor(() => expect(filterDomains).toHaveBeenCalledWith('Foo'));
  });

  it('shows expected headers and one row when list of domains is empty', () => {
    setUp(Mock.of<DomainsList>({ loading: false, error: false, filteredDomains: [] }));

    expect(screen.getAllByRole('columnheader')).toHaveLength(7);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('has many rows if multiple domains are provided', () => {
    const filteredDomains = [
      Mock.of<ShlinkDomain>({ domain: 'foo' }),
      Mock.of<ShlinkDomain>({ domain: 'bar' }),
      Mock.of<ShlinkDomain>({ domain: 'baz' }),
    ];
    setUp(Mock.of<DomainsList>({ loading: false, error: false, filteredDomains }));

    expect(screen.getAllByRole('row')).toHaveLength(filteredDomains.length + 1);
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(screen.getByText('baz')).toBeInTheDocument();
  });
});
