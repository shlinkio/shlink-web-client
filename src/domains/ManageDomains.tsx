import { FC, useEffect } from 'react';
import Message from '../utils/Message';
import { Result } from '../utils/Result';
import { ShlinkApiError } from '../api/ShlinkApiError';
import { SimpleCard } from '../utils/SimpleCard';
import SearchField from '../utils/SearchField';
import { ShlinkDomainRedirects } from '../api/types';
import { DomainsList } from './reducers/domainsList';
import { DomainRow } from './DomainRow';

interface ManageDomainsProps {
  listDomains: Function;
  filterDomains: (searchTerm: string) => void;
  editDomainRedirects: (domain: string, redirects: Partial<ShlinkDomainRedirects>) => Promise<void>;
  domainsList: DomainsList;
}

const headers = [ '', 'Domain', 'Base path redirect', 'Regular 404 redirect', 'Invalid short URL redirect', '' ];

export const ManageDomains: FC<ManageDomainsProps> = (
  { listDomains, domainsList, filterDomains, editDomainRedirects },
) => {
  const { filteredDomains: domains, loading, error, errorData } = domainsList;
  const defaultRedirects = domains.find(({ isDefault }) => isDefault)?.redirects;

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
        <table className="table table-hover mb-0">
          <thead>
            <tr>{headers.map((column, index) => <th key={index}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {domains.length < 1 && <tr><td colSpan={headers.length} className="text-center">No results found</td></tr>}
            {domains.map((domain) => (
              <DomainRow
                key={domain.domain}
                domain={domain}
                editDomainRedirects={editDomainRedirects}
                defaultRedirects={defaultRedirects}
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
