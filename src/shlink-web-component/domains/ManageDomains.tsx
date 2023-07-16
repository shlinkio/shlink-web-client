import type { FC } from 'react';
import { useEffect } from 'react';
import { ShlinkApiError } from '../../api/ShlinkApiError';
import type { SelectedServer } from '../../servers/data';
import { Message } from '../../utils/Message';
import { Result } from '../../utils/Result';
import { SearchField } from '../../utils/SearchField';
import { SimpleCard } from '../../utils/SimpleCard';
import { DomainRow } from './DomainRow';
import type { EditDomainRedirects } from './reducers/domainRedirects';
import type { DomainsList } from './reducers/domainsList';

interface ManageDomainsProps {
  listDomains: Function;
  filterDomains: (searchTerm: string) => void;
  editDomainRedirects: (redirects: EditDomainRedirects) => Promise<void>;
  checkDomainHealth: (domain: string) => void;
  domainsList: DomainsList;
  selectedServer: SelectedServer;
}

const headers = ['', 'Domain', 'Base path redirect', 'Regular 404 redirect', 'Invalid short URL redirect', '', ''];

export const ManageDomains: FC<ManageDomainsProps> = (
  { listDomains, domainsList, filterDomains, editDomainRedirects, checkDomainHealth, selectedServer },
) => {
  const { filteredDomains: domains, defaultRedirects, loading, error, errorData } = domainsList;
  const resolvedDefaultRedirects = defaultRedirects ?? domains.find(({ isDefault }) => isDefault)?.redirects;

  useEffect(() => {
    listDomains();
  }, []);

  if (loading) {
    return <Message loading />;
  }

  const renderContent = () => {
    if (error) {
      return (
        <Result type="error">
          <ShlinkApiError errorData={errorData} fallbackMessage="Error loading domains :(" />
        </Result>
      );
    }

    return (
      <SimpleCard>
        <table className="table table-hover responsive-table mb-0">
          <thead className="responsive-table__header">
            <tr>{headers.map((column, index) => <th key={index}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {domains.length < 1 && <tr><td colSpan={headers.length} className="text-center">No results found</td></tr>}
            {domains.map((domain) => (
              <DomainRow
                key={domain.domain}
                domain={domain}
                editDomainRedirects={editDomainRedirects}
                checkDomainHealth={checkDomainHealth}
                defaultRedirects={resolvedDefaultRedirects}
                selectedServer={selectedServer}
              />
            ))}
          </tbody>
        </table>
      </SimpleCard>
    );
  };

  return (
    <>
      <SearchField className="mb-3" onChange={filterDomains} />
      {renderContent()}
    </>
  );
};
