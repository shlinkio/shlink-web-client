import { FC, useEffect } from 'react';
import Message from '../utils/Message';
import { Result } from '../utils/Result';
import { ShlinkApiError } from '../api/ShlinkApiError';
import { SimpleCard } from '../utils/SimpleCard';
import SearchField from '../utils/SearchField';
import { ShlinkDomainRedirects } from '../api/types';
import { SelectedServer } from '../servers/data';
import { DomainsList } from './reducers/domainsList';
import { DomainRow } from './DomainRow';

interface ManageDomainsProps {
  listDomains: Function;
  filterDomains: (searchTerm: string) => void;
  editDomainRedirects: (domain: string, redirects: Partial<ShlinkDomainRedirects>) => Promise<void>;
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
