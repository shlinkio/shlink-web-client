import { FC, ReactNode } from 'react';
import { Row } from 'reactstrap';
import NoMenuLayout from '../common/NoMenuLayout';

const SettingsSections: FC<{ items: ReactNode[][] }> = ({ items }) => (
  <>
    {items.map((child, index) => (
      <Row key={index}>
        {child.map((subChild, subIndex) => (
          <div key={subIndex} className="col-lg-6 mb-3">
            {subChild}
          </div>
        ))}
      </Row>
    ))}
  </>
);

const Settings = (RealTimeUpdates: FC, ShortUrlCreation: FC, UserInterface: FC, Visits: FC) => () => (
  <NoMenuLayout>
    <SettingsSections
      items={[
        [ <UserInterface />, <ShortUrlCreation /> ], // eslint-disable-line react/jsx-key
        [ <Visits />, <RealTimeUpdates /> ], // eslint-disable-line react/jsx-key
      ]}
    />
  </NoMenuLayout>
);

export default Settings;
