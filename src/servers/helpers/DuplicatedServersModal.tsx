import { CardModal } from '@shlinkio/shlink-frontend-kit/tailwind';
import type { FC } from 'react';
import { Fragment } from 'react';
import type { ServerData } from '../data';

export type DuplicatedServersModalProps = {
  duplicatedServers: ServerData[];
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DuplicatedServersModal: FC<DuplicatedServersModalProps> = (
  { open, duplicatedServers, onClose, onConfirm },
) => {
  const hasMultipleServers = duplicatedServers.length > 1;

  return (
    <CardModal
      size="lg"
      title={`Duplicated server${hasMultipleServers ? 's' : ''}`}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={`Save duplicate${hasMultipleServers ? 's' : ''}`}
      cancelText={hasMultipleServers ? 'Ignore duplicates' : 'Discard'}
    >
      <p>{hasMultipleServers ? 'The next servers already exist:' : 'There is already a server with:'}</p>
      <ul className="tw:list-disc tw:mt-4">
        {duplicatedServers.map(({ url, apiKey }, index) => (!hasMultipleServers ? (
          <Fragment key={index}>
            <li>URL: <b>{url}</b></li>
            <li>API key: <b>{apiKey}</b></li>
          </Fragment>
        ) : <li key={index}><b>{url}</b> - <b>{apiKey}</b></li>))}
      </ul>
      <span>
        {hasMultipleServers ? 'Do you want to save duplicated servers' : 'Do you want to save this server'}?
      </span>
    </CardModal>
  );
};
