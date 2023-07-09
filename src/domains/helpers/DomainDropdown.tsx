import { faChartPie as pieChartIcon, faEdit as editIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { DropdownItem } from 'reactstrap';
import type { SelectedServer } from '../../servers/data';
import { getServerId } from '../../servers/data';
import { useFeature } from '../../utils/helpers/features';
import { useToggle } from '../../utils/helpers/hooks';
import { RowDropdownBtn } from '../../utils/RowDropdownBtn';
import { DEFAULT_DOMAIN } from '../../visits/reducers/domainVisits';
import type { Domain } from '../data';
import type { EditDomainRedirects } from '../reducers/domainRedirects';
import { EditDomainRedirectsModal } from './EditDomainRedirectsModal';

interface DomainDropdownProps {
  domain: Domain;
  editDomainRedirects: (redirects: EditDomainRedirects) => Promise<void>;
  selectedServer: SelectedServer;
}

export const DomainDropdown: FC<DomainDropdownProps> = ({ domain, editDomainRedirects, selectedServer }) => {
  const [isModalOpen, toggleModal] = useToggle();
  const { isDefault } = domain;
  const canBeEdited = !isDefault || useFeature('defaultDomainRedirectsEdition', selectedServer);
  const withVisits = useFeature('domainVisits', selectedServer);
  const serverId = getServerId(selectedServer);

  return (
    <RowDropdownBtn>
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
    </RowDropdownBtn>
  );
};
