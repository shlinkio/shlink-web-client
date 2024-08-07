import { faSyncAlt as reloadIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SimpleCard, useToggle } from '@shlinkio/shlink-frontend-kit';
import type { MouseEventHandler } from 'react';
import { forwardRef, useCallback } from 'react';
import { Alert, Button } from 'reactstrap';
import './AppUpdateBanner.scss';

interface AppUpdateBannerProps {
  isOpen: boolean;
  toggle: MouseEventHandler<any>;
  forceUpdate: () => void;
}

export const AppUpdateBanner = forwardRef<HTMLElement, AppUpdateBannerProps>(({ isOpen, toggle, forceUpdate }, ref) => {
  const [isUpdating,, setUpdating] = useToggle();
  const update = useCallback(() => {
    setUpdating();
    forceUpdate();
  }, [forceUpdate, setUpdating]);

  return (
    <Alert className="app-update-banner" isOpen={isOpen} toggle={toggle} tag={SimpleCard} color="secondary" innerRef={ref}>
      <h4 className="mb-4">This app has just been updated!</h4>
      <p className="mb-0">
        Restart it to enjoy the new features.
        <Button role="button" disabled={isUpdating} className="ms-2" color="secondary" size="sm" onClick={update}>
          {!isUpdating && <>Restart now <FontAwesomeIcon icon={reloadIcon} className="ms-1" /></>}
          {isUpdating && <>Restarting...</>}
        </Button>
      </p>
    </Alert>
  );
});
