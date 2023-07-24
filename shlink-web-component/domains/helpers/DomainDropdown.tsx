import { faChartPie as pieChartIcon, faEdit as editIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { DropdownItem } from 'reactstrap';
import { useToggle } from '../../../src/utils/helpers/hooks';
import { RowDropdownBtn } from '../../../src/utils/RowDropdownBtn';
import { useFeature } from '../../utils/features';
import { useRoutesPrefix } from '../../utils/routesPrefix';
import { DEFAULT_DOMAIN } from '../../visits/reducers/domainVisits';
import type { Domain } from '../data';
import type { EditDomainRedirects } from '../reducers/domainRedirects';
import { EditDomainRedirectsModal } from './EditDomainRedirectsModal';

interface DomainDropdownProps {
  domain: Domain;
  editDomainRedirects: (redirects: EditDomainRedirects) => Promise<void>;
}

export const DomainDropdown: FC<DomainDropdownProps> = ({ domain, editDomainRedirects }) => {
  const [isModalOpen, toggleModal] = useToggle();
  const { isDefault } = domain;
  const canBeEdited = !isDefault;
  const withVisits = useFeature('domainVisits');
  const routesPrefix = useRoutesPrefix();

  return (
    <RowDropdownBtn>
      {withVisits && (
        <DropdownItem
          tag={Link}
          to={`${routesPrefix}/domain/${domain.domain}${domain.isDefault ? `_${DEFAULT_DOMAIN}` : ''}/visits`}
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
