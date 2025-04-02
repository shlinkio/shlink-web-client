import { faSyncAlt as reloadIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggle } from '@shlinkio/shlink-frontend-kit';
import { Button, Card, CloseButton } from '@shlinkio/shlink-frontend-kit/tailwind';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { useCallback } from 'react';

interface AppUpdateBannerProps {
  isOpen: boolean;
  onClose: () => void;
  forceUpdate: () => void;
}

export const AppUpdateBanner: FC<AppUpdateBannerProps> = ({ isOpen, onClose, forceUpdate }) => {
  const [isUpdating,, setUpdating] = useToggle();
  const update = useCallback(() => {
    setUpdating();
    forceUpdate();
  }, [forceUpdate, setUpdating]);

  if (!isOpen) {
    return null;
  }

  return (
    <Card className={clsx(
      'tw:w-[700px] tw:max-w-[calc(100%-30px)]',
      'tw:fixed tw:top-[35px] tw:left-[50%] tw:translate-x-[-50%] tw:z-[1040]',
    )}>
      <Card.Header className="tw:flex tw:items-center tw:justify-between">
        <b>This app has just been updated!</b>
        <CloseButton onClick={onClose} />
      </Card.Header>
      <Card.Body className="tw:flex tw:gap-4 tw:items-center tw:justify-between tw:max-md:flex-col">
        Restart it to enjoy the new features.
        <Button disabled={isUpdating} variant="secondary" solid onClick={update}>
          {!isUpdating && <>Restart now <FontAwesomeIcon icon={reloadIcon} className="ms-1" /></>}
          {isUpdating && <>Restarting...</>}
        </Button>
      </Card.Body>
    </Card>
  );
};
