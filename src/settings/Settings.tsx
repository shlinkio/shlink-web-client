import { FC } from 'react';
import { Row } from 'reactstrap';
import NoMenuLayout from '../common/NoMenuLayout';

const Settings = (RealTimeUpdates: FC, ShortUrlCreation: FC, UserInterface:FC) => () => (
  <NoMenuLayout>
    <Row>
      <div className="col-lg-6">
        <div className="mb-3 mb-md-4">
          <UserInterface />
        </div>
        <div className="mb-3 mb-md-4">
          <ShortUrlCreation />
        </div>
      </div>
      <div className="col-lg-6">
        <RealTimeUpdates />
      </div>
    </Row>
  </NoMenuLayout>
);

export default Settings;
