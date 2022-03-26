import { FC, useEffect } from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan as forbiddenIcon,
  faDotCircle as defaultDomainIcon,
  faEdit as editIcon,
} from '@fortawesome/free-solid-svg-icons';
import { ShlinkDomainRedirects } from '../api/types';
import { useToggle } from '../utils/helpers/hooks';
import { OptionalString } from '../utils/utils';
import { SelectedServer } from '../servers/data';
import { supportsDefaultDomainRedirectsEdition } from '../utils/helpers/features';
import { EditDomainRedirectsModal } from './helpers/EditDomainRedirectsModal';
import { Domain } from './data';
import { DomainStatusIcon } from './helpers/DomainStatusIcon';

interface DomainRowProps {
  domain: Domain;
  defaultRedirects?: ShlinkDomainRedirects;
  editDomainRedirects: (domain: string, redirects: Partial<ShlinkDomainRedirects>) => Promise<void>;
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
  const [isOpen, toggle] = useToggle();
  const { domain: authority, isDefault, redirects, status } = domain;
  const canEditDomain = !isDefault || supportsDefaultDomainRedirectsEdition(selectedServer);

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
        <span id={!canEditDomain ? 'defaultDomainBtn' : undefined}>
          <Button outline size="sm" disabled={!canEditDomain} onClick={!canEditDomain ? undefined : toggle}>
            <FontAwesomeIcon fixedWidth icon={!canEditDomain ? forbiddenIcon : editIcon} />
          </Button>
        </span>
        {!canEditDomain && (
          <UncontrolledTooltip target="defaultDomainBtn" placement="left">
            Redirects for default domain cannot be edited here.
            <br />
            Use config options or env vars directly on the server.
          </UncontrolledTooltip>
        )}
      </td>
      <EditDomainRedirectsModal
        domain={domain}
        isOpen={isOpen}
        toggle={toggle}
        editDomainRedirects={editDomainRedirects}
      />
    </tr>
  );
};
