import { faSyncAlt as reloadIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, CloseButton,useToggle  } from '@shlinkio/shlink-frontend-kit';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { useCallback } from 'react';

interface AppUpdateBannerProps {
  isOpen: boolean;
  onClose: () => void;
  forceUpdate: () => void;
}

export const AppUpdateBanner: FC<AppUpdateBannerProps> = ({ isOpen, onClose, forceUpdate }) => {
  const { flag: isUpdating, setToTrue: setUpdating } = useToggle();
  const update = useCallback(() => {
    setUpdating();
    forceUpdate();
  }, [forceUpdate, setUpdating]);

  if (!isOpen) {
    return null;
  }

  return (
    <Card
      role="alert"
      className={clsx(
        'w-[700px] max-w-[calc(100%-30px)]',
        'fixed top-[35px] left-[50%] translate-x-[-50%] z-[1040]',
      )}
    >
      <Card.Header className="flex items-center justify-between">
        <h5>This app has just been updated!</h5>
        <CloseButton onClick={onClose} />
      </Card.Header>
      <Card.Body className="flex gap-4 items-center justify-between max-md:flex-col">
        Restart it to enjoy the new features.
        <Button disabled={isUpdating} variant="secondary" solid onClick={update}>
          {!isUpdating && <>Restart now <FontAwesomeIcon icon={reloadIcon} /></>}
          {isUpdating && <>Restarting...</>}
        </Button>
      </Card.Body>
    </Card>
  );
};
