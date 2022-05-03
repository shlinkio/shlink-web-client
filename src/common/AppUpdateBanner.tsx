import { FC, MouseEventHandler } from 'react';
import { Alert, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt as reloadIcon } from '@fortawesome/free-solid-svg-icons';
import { SimpleCard } from '../utils/SimpleCard';
import { useToggle } from '../utils/helpers/hooks';
import './AppUpdateBanner.scss';

interface AppUpdateBannerProps {
  isOpen: boolean;
  toggle: MouseEventHandler<any>;
  forceUpdate: Function;
}

export const AppUpdateBanner: FC<AppUpdateBannerProps> = ({ isOpen, toggle, forceUpdate }) => {
  const [isUpdating,, setUpdating] = useToggle();
  const update = () => {
    setUpdating();
    forceUpdate();
  };

  return (
    <Alert className="app-update-banner" isOpen={isOpen} toggle={toggle} tag={SimpleCard} color="secondary">
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
};
