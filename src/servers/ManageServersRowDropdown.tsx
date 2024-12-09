import { faCircle as toggleOnIcon } from '@fortawesome/free-regular-svg-icons';
import {
  faBan as toggleOffIcon,
  faEdit as editIcon,
  faMinusCircle as deleteIcon,
  faPlug as connectIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RowDropdownBtn, useToggle } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { Link } from 'react-router';
import { DropdownItem } from 'reactstrap';
import type { FCWithDeps } from '../container/utils';
import { componentFactory, useDependencies } from '../container/utils';
import type { ServerWithId } from './data';
import type { DeleteServerModalProps } from './DeleteServerModal';

export type ManageServersRowDropdownProps = {
  server: ServerWithId;
};

type ManageServersRowDropdownConnectProps = ManageServersRowDropdownProps & {
  setAutoConnect: (server: ServerWithId, autoConnect: boolean) => void;
};

type ManageServersRowDropdownDeps = {
  DeleteServerModal: FC<DeleteServerModalProps>
};

const ManageServersRowDropdown: FCWithDeps<ManageServersRowDropdownConnectProps, ManageServersRowDropdownDeps> = (
  { server, setAutoConnect },
) => {
  const { DeleteServerModal } = useDependencies(ManageServersRowDropdown);
  const [isModalOpen,, showModal, hideModal] = useToggle();
  const serverUrl = `/server/${server.id}`;
  const { autoConnect: isAutoConnect } = server;
  const autoConnectIcon = isAutoConnect ? toggleOffIcon : toggleOnIcon;

  return (
    <RowDropdownBtn minWidth={isAutoConnect ? 210 : 170}>
      <DropdownItem tag={Link} to={serverUrl}>
        <FontAwesomeIcon icon={connectIcon} fixedWidth /> Connect
      </DropdownItem>
      <DropdownItem tag={Link} to={`${serverUrl}/edit`}>
        <FontAwesomeIcon icon={editIcon} fixedWidth /> Edit server
      </DropdownItem>
      <DropdownItem onClick={() => setAutoConnect(server, !isAutoConnect)}>
        <FontAwesomeIcon icon={autoConnectIcon} fixedWidth /> {isAutoConnect ? 'Do not a' : 'A'}uto-connect
      </DropdownItem>
      <DropdownItem divider tag="hr" />
      <DropdownItem className="dropdown-item--danger" onClick={showModal}>
        <FontAwesomeIcon icon={deleteIcon} fixedWidth /> Remove server
      </DropdownItem>

      <DeleteServerModal redirectHome={false} server={server} isOpen={isModalOpen} toggle={hideModal} />
    </RowDropdownBtn>
  );
};

export const ManageServersRowDropdownFactory = componentFactory(ManageServersRowDropdown, ['DeleteServerModal']);
