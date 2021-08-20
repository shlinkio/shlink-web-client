import { FC, useEffect } from 'react';
import { faCheck as defaultDomainIcon, faEdit as editIcon, faBan as forbiddenIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, UncontrolledTooltip } from 'reactstrap';
import Message from '../utils/Message';
import { Result } from '../utils/Result';
import { ShlinkApiError } from '../api/ShlinkApiError';
import { SimpleCard } from '../utils/SimpleCard';
import SearchField from '../utils/SearchField';
import { DomainsList } from './reducers/domainsList';

interface ManageDomainsProps {
  listDomains: Function;
  domainsList: DomainsList;
}

const Na: FC = () => <i><small>N/A</small></i>;
const DefaultDomain: FC = () => (
  <>
    <FontAwesomeIcon icon={defaultDomainIcon} className="text-primary" id="defaultDomainIcon" />
    <UncontrolledTooltip target="defaultDomainIcon" placement="right">Default domain</UncontrolledTooltip>
  </>
);

export const ManageDomains: FC<ManageDomainsProps> = ({ listDomains, domainsList }) => {
  const { domains, loading, error } = domainsList;

  useEffect(() => {
    listDomains();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <Message loading />;
    }

    if (error) {
      return (
        <Result type="error">
          <ShlinkApiError fallbackMessage="Error loading domains :(" />
        </Result>
      );
    }

    return (
      <SimpleCard>
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th />
              <th>Domain</th>
              <th>Base path redirect</th>
              <th>Regular 404 redirect</th>
              <th>Invalid short URL redirect</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {domains.map((domain) => (
              <tr key={domain.domain}>
                <td>{domain.isDefault ? <DefaultDomain /> : ''}</td>
                <th>{domain.domain}</th>
                <td>{domain.redirects?.baseUrlRedirect ?? <Na />}</td>
                <td>{domain.redirects?.regular404Redirect ?? <Na />}</td>
                <td>{domain.redirects?.invalidShortUrlRedirect ?? <Na />}</td>
                <td className="text-right">
                  <span id={`domainEdit${domain.domain.replace('.', '')}`}>
                    <Button outline size="sm" disabled={domain.isDefault}>
                      <FontAwesomeIcon icon={domain.isDefault ? forbiddenIcon : editIcon} />
                    </Button>
                  </span>
                  {domain.isDefault && (
                    <UncontrolledTooltip target={`domainEdit${domain.domain.replace('.', '')}`} placement="left">
                      Redirects for default domain cannot be edited here.
                    </UncontrolledTooltip>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SimpleCard>
    );
  };

  return (
    <>
      <SearchField className="mb-3" onChange={() => {}} />
      {renderContent()}
    </>
  );
};
