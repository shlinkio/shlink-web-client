import { faDotCircle as defaultDomainIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import { useEffect } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import type { OptionalString } from '../../src/utils/utils';
import type { ShlinkDomainRedirects } from '../api-contract';
import type { Domain } from './data';
import { DomainDropdown } from './helpers/DomainDropdown';
import { DomainStatusIcon } from './helpers/DomainStatusIcon';
import type { EditDomainRedirects } from './reducers/domainRedirects';

interface DomainRowProps {
  domain: Domain;
  defaultRedirects?: ShlinkDomainRedirects;
  editDomainRedirects: (redirects: EditDomainRedirects) => Promise<void>;
  checkDomainHealth: (domain: string) => void;
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
  { domain, editDomainRedirects, checkDomainHealth, defaultRedirects },
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
        <DomainDropdown domain={domain} editDomainRedirects={editDomainRedirects} />
      </td>
    </tr>
  );
};
