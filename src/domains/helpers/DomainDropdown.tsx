import type { FC } from 'react';
import { DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { faChartPie as pieChartIcon, faEdit as editIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggle } from '../../utils/helpers/hooks';
import { DropdownBtnMenu } from '../../utils/DropdownBtnMenu';
import { EditDomainRedirectsModal } from './EditDomainRedirectsModal';
import type { Domain } from '../data';
import type { EditDomainRedirects } from '../reducers/domainRedirects';
import { supportsDefaultDomainRedirectsEdition, supportsDomainVisits } from '../../utils/helpers/features';
import type { SelectedServer } from '../../servers/data';
import { getServerId } from '../../servers/data';
import { DEFAULT_DOMAIN } from '../../visits/reducers/domainVisits';

interface DomainDropdownProps {
  domain: Domain;
  editDomainRedirects: (redirects: EditDomainRedirects) => Promise<void>;
  selectedServer: SelectedServer;
}

export const DomainDropdown: FC<DomainDropdownProps> = ({ domain, editDomainRedirects, selectedServer }) => {
  const [isOpen, toggle] = useToggle();
  const [isModalOpen, toggleModal] = useToggle();
  const { isDefault } = domain;
  const canBeEdited = !isDefault || supportsDefaultDomainRedirectsEdition(selectedServer);
  const withVisits = supportsDomainVisits(selectedServer);
  const serverId = getServerId(selectedServer);

  return (
    <DropdownBtnMenu isOpen={isOpen} toggle={toggle}>
      {withVisits && (
        <DropdownItem
          tag={Link}
          to={`/server/${serverId}/domain/${domain.domain}${domain.isDefault ? `_${DEFAULT_DOMAIN}` : ''}/visits`}
        >
          <FontAwesomeIcon icon={pieChartIcon} fixedWidth /> Visit stats
        </DropdownItem>
      )}
      <DropdownItem disabled={!canBeEdited} onClick={!canBeEdited ? undefined : toggleModal}>
        <FontAwesomeIcon fixedWidth icon={editIcon} /> Edit redirects
      </DropdownItem>

      <EditDomainRedirectsModal
        domain={domain}
        isOpen={isModalOpen}
        toggle={toggleModal}
        editDomainRedirects={editDomainRedirects}
      />
    </DropdownBtnMenu>
  );
};
