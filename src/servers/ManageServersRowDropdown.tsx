import { faCircle as toggleOnIcon } from '@fortawesome/free-regular-svg-icons';
import {
  faBan as toggleOffIcon,
  faEdit as editIcon,
  faMinusCircle as deleteIcon,
  faPlug as connectIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RowDropdown,useToggle  } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
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
  const { flag: isModalOpen, setToTrue: showModal, setToFalse: hideModal } = useToggle();
  const serverUrl = `/server/${server.id}`;
  const { autoConnect: isAutoConnect } = server;
  const autoConnectIcon = isAutoConnect ? toggleOffIcon : toggleOnIcon;

  return (
    <>
      <RowDropdown menuAlignment="right">
        <RowDropdown.Item to={serverUrl} className="gap-1.5">
          <FontAwesomeIcon icon={connectIcon} fixedWidth /> Connect
        </RowDropdown.Item>
        <RowDropdown.Item to={`${serverUrl}/edit`} className="gap-1.5">
          <FontAwesomeIcon icon={editIcon} fixedWidth /> Edit server
        </RowDropdown.Item>
        <RowDropdown.Item onClick={() => setAutoConnect(server, !isAutoConnect)} className="gap-1.5">
          <FontAwesomeIcon icon={autoConnectIcon} fixedWidth /> {isAutoConnect ? 'Do not a' : 'A'}uto-connect
        </RowDropdown.Item>
        <RowDropdown.Separator />
        <RowDropdown.Item className="[&]:text-danger gap-1.5" onClick={showModal}>
          <FontAwesomeIcon icon={deleteIcon} fixedWidth /> Remove server
        </RowDropdown.Item>
      </RowDropdown>

      <DeleteServerModal server={server} open={isModalOpen} onClose={hideModal} />
    </>
  );
};

export const ManageServersRowDropdownFactory = componentFactory(ManageServersRowDropdown, ['DeleteServerModal']);
