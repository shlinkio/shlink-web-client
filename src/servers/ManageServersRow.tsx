import { FC } from 'react';
import { DropdownItem, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck as checkIcon,
  faEdit as editIcon,
  faMinusCircle as deleteIcon,
  faPlug as connectIcon,
  faToggleOn as toggleOnIcon,
  faToggleOff as toggleOffIcon,
} from '@fortawesome/free-solid-svg-icons';
import { DropdownBtnMenu } from '../utils/DropdownBtnMenu';
import { useToggle } from '../utils/helpers/hooks';
import { ServerWithId } from './data';
import { DeleteServerModalProps } from './DeleteServerModal';

export interface ManageServersRowProps {
  server: ServerWithId;
  hasAutoConnect: boolean;
}

export const ManageServersRow = (
  DeleteServerModal: FC<DeleteServerModalProps>,
): FC<ManageServersRowProps> => ({ server, hasAutoConnect }) => {
  const [ isMenuOpen, toggleMenu ] = useToggle();
  const [ isModalOpen,, showModal, hideModal ] = useToggle();
  const serverUrl = `/server/${server.id}`;
  const { autoConnect: isAutoConnect } = server;
  const autoConnectIcon = isAutoConnect ? toggleOnIcon : toggleOffIcon;

  return (
    <tr className="responsive-table__row">
      {hasAutoConnect && (
        <td className="responsive-table__cell text-lg-right" data-th="Auto-connect">
          {isAutoConnect && (
            <>
              <FontAwesomeIcon icon={checkIcon} className="text-primary" id="autoConnectIcon" />
              <UncontrolledTooltip target="autoConnectIcon">Auto-connect to this server</UncontrolledTooltip>
            </>
          )}
        </td>
      )}
      <th className="responsive-table__cell" data-th="Name">
        <Link to={serverUrl}>{server.name}</Link>
      </th>
      <td className="responsive-table__cell" data-th="Base URL">{server.url}</td>
      <td className="responsive-table__cell text-right">
        <DropdownBtnMenu isOpen={isMenuOpen} toggle={toggleMenu}>
          <DropdownItem tag={Link} to={serverUrl}>
            <FontAwesomeIcon icon={connectIcon} fixedWidth /> Connect
          </DropdownItem>
          <DropdownItem tag={Link} to={`${serverUrl}/edit`}>
            <FontAwesomeIcon icon={editIcon} fixedWidth /> Edit server
          </DropdownItem>
          <DropdownItem>
            <FontAwesomeIcon icon={autoConnectIcon} fixedWidth /> {isAutoConnect ? 'Unset' : 'Set'} auto-connect
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem className="dropdown-item--danger" onClick={showModal}>
            <FontAwesomeIcon icon={deleteIcon} fixedWidth /> Remove server
          </DropdownItem>
          <DeleteServerModal redirectHome={false} server={server} isOpen={isModalOpen} toggle={hideModal} />
        </DropdownBtnMenu>
      </td>
    </tr>
  );
};
