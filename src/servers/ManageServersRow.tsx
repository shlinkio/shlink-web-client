import { FC } from 'react';
import { DropdownItem, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck as checkIcon,
  faEdit as editIcon,
  faMinusCircle as deleteIcon,
  faPlug as connectIcon,
  faBan as toggleOffIcon,
} from '@fortawesome/free-solid-svg-icons';
import { faCircle as toggleOnIcon } from '@fortawesome/free-regular-svg-icons';
import { DropdownBtnMenu } from '../utils/DropdownBtnMenu';
import { useToggle } from '../utils/helpers/hooks';
import { ServerWithId } from './data';
import { DeleteServerModalProps } from './DeleteServerModal';

export interface ManageServersRowProps {
  server: ServerWithId;
  hasAutoConnect: boolean;
}

interface ManageServersRowPropsConnectProps extends ManageServersRowProps {
  setAutoConnect: (server: ServerWithId, autoConnect: boolean) => void;
}

export const ManageServersRow = (
  DeleteServerModal: FC<DeleteServerModalProps>,
): FC<ManageServersRowPropsConnectProps> => ({ server, hasAutoConnect, setAutoConnect }) => {
  const [ isMenuOpen, toggleMenu ] = useToggle();
  const [ isModalOpen,, showModal, hideModal ] = useToggle();
  const serverUrl = `/server/${server.id}`;
  const { autoConnect: isAutoConnect } = server;
  const autoConnectIcon = isAutoConnect ? toggleOffIcon : toggleOnIcon;

  return (
    <tr className="responsive-table__row">
      {hasAutoConnect && (
        <td className="responsive-table__cell" data-th="Auto-connect">
          {isAutoConnect && (
            <>
              <FontAwesomeIcon icon={checkIcon} className="text-primary" id="autoConnectIcon" />
              <UncontrolledTooltip target="autoConnectIcon" placement="right">
                Auto-connect to this server
              </UncontrolledTooltip>
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
          <DropdownItem onClick={() => setAutoConnect(server, !server.autoConnect)}>
            <FontAwesomeIcon icon={autoConnectIcon} fixedWidth /> {isAutoConnect ? 'Do not a' : 'A'}uto-connect
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
