import { FC } from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan as forbiddenIcon,
  faCheck as defaultDomainIcon,
  faEdit as editIcon,
} from '@fortawesome/free-solid-svg-icons';
import { ShlinkDomain, ShlinkDomainRedirects } from '../api/types';
import { useToggle } from '../utils/helpers/hooks';
import { OptionalString } from '../utils/utils';
import { EditDomainRedirectsModal } from './helpers/EditDomainRedirectsModal';

interface DomainRowProps {
  domain: ShlinkDomain;
  defaultRedirects?: ShlinkDomainRedirects;
  editDomainRedirects: (domain: string, redirects: Partial<ShlinkDomainRedirects>) => Promise<void>;
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

export const DomainRow: FC<DomainRowProps> = ({ domain, editDomainRedirects, defaultRedirects }) => {
  const [ isOpen, toggle ] = useToggle();
  const { domain: authority, isDefault, redirects } = domain;

  return (
    <tr className="responsive-table__row">
      <td className="responsive-table__cell" data-th="Is default domain">{isDefault ? <DefaultDomain /> : ''}</td>
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
      <td className="responsive-table__cell text-right">
        <span id={isDefault ? 'defaultDomaiBtn' : undefined}>
          <Button outline size="sm" disabled={isDefault} onClick={isDefault ? undefined : toggle}>
            <FontAwesomeIcon fixedWidth icon={isDefault ? forbiddenIcon : editIcon} />
          </Button>
        </span>
        {isDefault && (
          <UncontrolledTooltip target="defaultDomaiBtn" placement="left">
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
