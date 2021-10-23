import { FC } from 'react';
import { DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan as toggleOffIcon,
  faEdit as editIcon,
  faMinusCircle as deleteIcon,
  faPlug as connectIcon,
} from '@fortawesome/free-solid-svg-icons';
import { faCircle as toggleOnIcon } from '@fortawesome/free-regular-svg-icons';
import { DropdownBtnMenu } from '../utils/DropdownBtnMenu';
import { useToggle } from '../utils/helpers/hooks';
import { DeleteServerModalProps } from './DeleteServerModal';
import { ServerWithId } from './data';

export interface ManageServersRowDropdownProps {
  server: ServerWithId;
}

interface ManageServersRowDropdownConnectProps extends ManageServersRowDropdownProps {
  setAutoConnect: (server: ServerWithId, autoConnect: boolean) => void;
}

export const ManageServersRowDropdown = (
  DeleteServerModal: FC<DeleteServerModalProps>,
): FC<ManageServersRowDropdownConnectProps> => ({ server, setAutoConnect }) => {
  const [ isMenuOpen, toggleMenu ] = useToggle();
  const [ isModalOpen,, showModal, hideModal ] = useToggle();
  const serverUrl = `/server/${server.id}`;
  const { autoConnect: isAutoConnect } = server;
  const autoConnectIcon = isAutoConnect ? toggleOffIcon : toggleOnIcon;

  return (
    <DropdownBtnMenu isOpen={isMenuOpen} toggle={toggleMenu}>
      <DropdownItem tag={Link} to={serverUrl}>
        <FontAwesomeIcon icon={connectIcon} fixedWidth /> Connect
      </DropdownItem>
      <DropdownItem tag={Link} to={`${serverUrl}/edit`}>
        <FontAwesomeIcon icon={editIcon} fixedWidth /> Edit server
      </DropdownItem>
      <DropdownItem onClick={() => setAutoConnect(server, !server.autoConnect)}>
        <FontAwesomeIcon icon={autoConnectIcon} fixedWidth /> {isAutoConnect ? 'Do not a' : 'A'}uto-connect
      </DropdownItem>
      <DropdownItem divider />
      <DropdownItem className="dropdown-item--danger" onClick={showModal}>
        <FontAwesomeIcon icon={deleteIcon} fixedWidth /> Remove server
      </DropdownItem>

      <DeleteServerModal redirectHome={false} server={server} isOpen={isModalOpen} toggle={hideModal} />
    </DropdownBtnMenu>
  );
};
