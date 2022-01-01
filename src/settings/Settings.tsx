import { FC, ReactNode } from 'react';
import { Row } from 'reactstrap';
import { NoMenuLayout } from '../common/NoMenuLayout';

const SettingsSections: FC<{ items: ReactNode[][] }> = ({ items }) => (
  <>
    {items.map((child, index) => (
      <Row key={index}>
        {child.map((subChild, subIndex) => (
          <div key={subIndex} className={`col-lg-${12 / child.length} mb-3`}>
            {subChild}
          </div>
        ))}
      </Row>
    ))}
  </>
);

const Settings = (
  RealTimeUpdates: FC,
  ShortUrlCreation: FC,
  ShortUrlsList: FC,
  UserInterface: FC,
  Visits: FC,
  Tags: FC,
) => () => (
  <NoMenuLayout>
    <SettingsSections
      items={[
        [ <UserInterface />, <Visits /> ], // eslint-disable-line react/jsx-key
        [ <ShortUrlCreation />, <ShortUrlsList /> ], // eslint-disable-line react/jsx-key
        [ <Tags />, <RealTimeUpdates /> ], // eslint-disable-line react/jsx-key
      ]}
    />
  </NoMenuLayout>
);

export default Settings;
