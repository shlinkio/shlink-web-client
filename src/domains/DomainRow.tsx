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
    <FontAwesomeIcon icon={defaultDomainIcon} className="text-primary" id="defaultDomainIcon" />
    <UncontrolledTooltip target="defaultDomainIcon" placement="right">Default domain</UncontrolledTooltip>
  </>
);

export const DomainRow: FC<DomainRowProps> = ({ domain, editDomainRedirects, defaultRedirects }) => {
  const [ isOpen, toggle ] = useToggle();
  const { domain: authority, isDefault, redirects } = domain;
  const domainId = `domainEdit${authority.replace('.', '')}`;

  return (
    <tr>
      <td>{isDefault ? <DefaultDomain /> : ''}</td>
      <th>{authority}</th>
      <td>{redirects?.baseUrlRedirect ?? <Nr fallback={defaultRedirects?.baseUrlRedirect} />}</td>
      <td>{redirects?.regular404Redirect ?? <Nr fallback={defaultRedirects?.regular404Redirect} />}</td>
      <td>
        {redirects?.invalidShortUrlRedirect ?? <Nr fallback={defaultRedirects?.invalidShortUrlRedirect} />}
      </td>
      <td className="text-right">
        <span id={domainId}>
          <Button outline size="sm" disabled={isDefault} onClick={isDefault ? undefined : toggle}>
            <FontAwesomeIcon icon={isDefault ? forbiddenIcon : editIcon} />
          </Button>
        </span>
        {isDefault && (
          <UncontrolledTooltip target={domainId} placement="left">
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
