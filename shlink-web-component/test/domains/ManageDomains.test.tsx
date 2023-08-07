import { screen, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { ProblemDetailsError, ShlinkDomain } from '../../src/api-contract';
import { ManageDomains } from '../../src/domains/ManageDomains';
import type { DomainsList } from '../../src/domains/reducers/domainsList';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<ManageDomains />', () => {
  const listDomains = vi.fn();
  const filterDomains = vi.fn();
  const setUp = (domainsList: DomainsList) => renderWithEvents(
    <ManageDomains
      listDomains={listDomains}
      filterDomains={filterDomains}
      editDomainRedirects={vi.fn()}
      checkDomainHealth={vi.fn()}
      domainsList={domainsList}
    />,
  );

  it('shows loading message while domains are loading', () => {
    setUp(fromPartial({ loading: true, filteredDomains: [] }));

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Error loading domains :(')).not.toBeInTheDocument();
  });

  it.each([
    [undefined, 'Error loading domains :('],
    [fromPartial<ProblemDetailsError>({}), 'Error loading domains :('],
    [fromPartial<ProblemDetailsError>({ detail: 'Foo error!!' }), 'Foo error!!'],
  ])('shows error result when domains loading fails', (errorData, expectedErrorMessage) => {
    setUp(fromPartial({ loading: false, error: true, errorData, filteredDomains: [] }));

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText(expectedErrorMessage)).toBeInTheDocument();
  });

  it('filters domains when SearchField changes', async () => {
    const { user } = setUp(fromPartial({ loading: false, error: false, filteredDomains: [] }));

    expect(filterDomains).not.toHaveBeenCalled();
    await user.type(screen.getByPlaceholderText('Search...'), 'Foo');
    await waitFor(() => expect(filterDomains).toHaveBeenCalledWith('Foo'));
  });

  it('shows expected headers and one row when list of domains is empty', () => {
    setUp(fromPartial({ loading: false, error: false, filteredDomains: [] }));

    expect(screen.getAllByRole('columnheader')).toHaveLength(7);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('has many rows if multiple domains are provided', () => {
    const filteredDomains: ShlinkDomain[] = [
      fromPartial({ domain: 'foo' }),
      fromPartial({ domain: 'bar' }),
      fromPartial({ domain: 'baz' }),
    ];
    setUp(fromPartial({ loading: false, error: false, filteredDomains }));

    expect(screen.getAllByRole('row')).toHaveLength(filteredDomains.length + 1);
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(screen.getByText('baz')).toBeInTheDocument();
  });
});
