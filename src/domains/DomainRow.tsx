import { FC, useEffect } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle as defaultDomainIcon } from '@fortawesome/free-solid-svg-icons';
import { ShlinkDomainRedirects } from '../api/types';
import { OptionalString } from '../utils/utils';
import { SelectedServer } from '../servers/data';
import { Domain } from './data';
import { DomainStatusIcon } from './helpers/DomainStatusIcon';
import { DomainDropdown } from './helpers/DomainDropdown';
import { EditDomainRedirects } from './reducers/domainRedirects';

interface DomainRowProps {
  domain: Domain;
  defaultRedirects?: ShlinkDomainRedirects;
  editDomainRedirects: (redirects: EditDomainRedirects) => Promise<void>;
  checkDomainHealth: (domain: string) => void;
  selectedServer: SelectedServer;
}

const Nr: FC<{ fallback: OptionalString }> = ({ fallback }) => (
  <span className="text-muted">
    {!fallback && <small>No redirect</small>}
    {fallback && <>{fallback} <small>(as fallback)</small></>}
  </span>
);
const DefaultDomain: FC = () => (
  <>
    <FontAwesomeIcon fixedWidth icon={defaultDomainIcon} className="text-primary" id="defaultDomainIcon" />
    <UncontrolledTooltip target="defaultDomainIcon" placement="right">Default domain</UncontrolledTooltip>
  </>
);

export const DomainRow: FC<DomainRowProps> = (
  { domain, editDomainRedirects, checkDomainHealth, defaultRedirects, selectedServer },
) => {
  const { domain: authority, isDefault, redirects, status } = domain;

  useEffect(() => {
    checkDomainHealth(domain.domain);
  }, []);

  return (
    <tr className="responsive-table__row">
      <td className="responsive-table__cell" data-th="Is default domain">{isDefault && <DefaultDomain />}</td>
      <th className="responsive-table__cell" data-th="Domain">{authority}</th>
      <td className="responsive-table__cell" data-th="Base path redirect">
        {redirects?.baseUrlRedirect ?? <Nr fallback={defaultRedirects?.baseUrlRedirect} />}
      </td>
      <td className="responsive-table__cell" data-th="Regular 404 redirect">
        {redirects?.regular404Redirect ?? <Nr fallback={defaultRedirects?.regular404Redirect} />}
      </td>
      <td className="responsive-table__cell" data-th="Invalid short URL redirect">
        {redirects?.invalidShortUrlRedirect ?? <Nr fallback={defaultRedirects?.invalidShortUrlRedirect} />}
      </td>
      <td className="responsive-table__cell text-lg-center" data-th="Status">
        <DomainStatusIcon status={status} />
      </td>
      <td className="responsive-table__cell text-end">
        <DomainDropdown domain={domain} editDomainRedirects={editDomainRedirects} selectedServer={selectedServer} />
      </td>
    </tr>
  );
};
