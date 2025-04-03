import { CardModal } from '@shlinkio/shlink-frontend-kit/tailwind';
import type { FC } from 'react';
import { useCallback } from 'react';
import type { ServerWithId } from './data';

export type DeleteServerModalProps = {
  server: ServerWithId;
  onClose: (confirmed: boolean) => void;
  open: boolean;
};

type DeleteServerModalConnectProps = DeleteServerModalProps & {
  deleteServer: (server: ServerWithId) => void;
};

export const DeleteServerModal: FC<DeleteServerModalConnectProps> = ({ server, onClose, open, deleteServer }) => {
  const onConfirm = useCallback(() => {
    deleteServer(server);
    onClose(true);
  }, [deleteServer, onClose, server]);

  return (
    <CardModal
      open={open}
      title="Remove server"
      variant="danger"
      onClose={() => onClose(false)}
      onConfirm={onConfirm}
      confirmText="Delete"
    >
      <p>Are you sure you want to remove <b>{server ? server.name : ''}</b>?</p>
      <p>
        <i>
          No data will be deleted, only the access to this server will be removed from this device.
          You can create it again at any moment.
        </i>
      </p>
    </CardModal>
  );
};
