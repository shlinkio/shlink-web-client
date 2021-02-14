import { FC } from 'react';
import { Row } from 'reactstrap';
import NoMenuLayout from '../common/NoMenuLayout';

const Settings = (RealTimeUpdates: FC, ShortUrlCreation: FC) => () => (
  <NoMenuLayout>
    <Row>
      <div className="col-lg-6">
        <RealTimeUpdates />
      </div>
      <div className="col-lg-6">
        <ShortUrlCreation />
      </div>
    </Row>
  </NoMenuLayout>
);

export default Settings;
