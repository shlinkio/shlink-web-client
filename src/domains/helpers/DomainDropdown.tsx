import { FC } from 'react';
import { DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { faChartPie as pieChartIcon, faEdit as editIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggle } from '../../utils/helpers/hooks';
import { DropdownBtnMenu } from '../../utils/DropdownBtnMenu';
import { EditDomainRedirectsModal } from './EditDomainRedirectsModal';
import { Domain } from '../data';
import { ShlinkDomainRedirects } from '../../api/types';
import { supportsDefaultDomainRedirectsEdition, supportsDomainVisits } from '../../utils/helpers/features';
import { getServerId, SelectedServer } from '../../servers/data';

interface DomainDropdownProps {
  domain: Domain;
  editDomainRedirects: (domain: string, redirects: Partial<ShlinkDomainRedirects>) => Promise<void>;
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
      <DropdownItem disabled={!canBeEdited} onClick={!canBeEdited ? undefined : toggleModal}>
        <FontAwesomeIcon fixedWidth icon={editIcon} /> Edit redirects
      </DropdownItem>
      {withVisits && (
        <DropdownItem tag={Link} to={`/server/${serverId}/domain/${isDefault ? 'DEFAULT' : domain.domain}/visits`}>
          <FontAwesomeIcon icon={pieChartIcon} fixedWidth /> Visit stats
        </DropdownItem>
      )}

      <EditDomainRedirectsModal
        domain={domain}
        isOpen={isModalOpen}
        toggle={toggleModal}
        editDomainRedirects={editDomainRedirects}
      />
    </DropdownBtnMenu>
  );
};
