import type { ExitAction } from '@shlinkio/shlink-frontend-kit/tailwind';
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
  const onClosed = useCallback((exitAction: ExitAction) => {
    if (exitAction === 'confirm') {
      deleteServer(server);
    }
  }, [deleteServer, server]);

  return (
    <CardModal
      open={open}
      title="Remove server"
      variant="danger"
      onClose={() => onClose(false)}
      onConfirm={() => onClose(true)}
      onClosed={onClosed}
      confirmText="Delete"
    >
      <div className="tw:flex tw:flex-col tw:gap-y-4">
        <p>Are you sure you want to remove <b>{server ? server.name : ''}</b>?</p>
        <p>
          <i>
            No data will be deleted, only the access to this server will be removed from this device.
            You can create it again at any moment.
          </i>
        </p>
      </div>
    </CardModal>
  );
};
