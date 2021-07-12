import { FC, MouseEventHandler } from 'react';
import { Alert } from 'reactstrap';
import { SimpleCard } from '../utils/SimpleCard';
import './AppUpdateBanner.scss';

interface AppUpdateBannerProps {
  isOpen: boolean;
  toggle: MouseEventHandler<any>;
}

export const AppUpdateBanner: FC<AppUpdateBannerProps> = (props) => (
  <Alert className="app-update-banner" {...props} tag={SimpleCard} color="secondary">
    <h4 className="mb-4">This app has just been updated!</h4>
    <p className="mb-0">Restart it to enjoy the new features.</p>
  </Alert>
);
