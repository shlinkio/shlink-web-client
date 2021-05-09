import { isEmpty, values } from 'ramda';
import { Link } from 'react-router-dom';
import { Card, Row } from 'reactstrap';
import { ExternalLink } from 'react-external-link';
import ServersListGroup from '../servers/ServersListGroup';
import './Home.scss';
import { ServersMap } from '../servers/data';
import { ShlinkLogo } from './img/ShlinkLogo';

export interface HomeProps {
  servers: ServersMap;
}

const Home = ({ servers }: HomeProps) => {
  const serversList = values(servers);
  const hasServers = !isEmpty(serversList);

  return (
    <div className="home">
      <Card className="home__main-card">
        <Row noGutters>
          <div className="col-md-5 d-none d-md-block">
            <div className="p-4">
              <ShlinkLogo />
            </div>
          </div>
          <div className="col-md-7 home__servers-container">
            <div className="p-4">
              <h1 className="home__title" style={{ background: 'red' }}>Edited nine times!</h1>
            </div>
            <ServersListGroup embedded servers={serversList}>
              {!hasServers && (
                <div className="p-4">
                  <p>This application will help you to manage your Shlink servers.</p>
                  <p>To start, please, <Link to="/server/create">add your first server</Link>.</p>
                  <p className="m-0">
                    You still don&lsquo;t have a Shlink server?
                    Learn how to <ExternalLink href="https://shlink.io/documentation">get started</ExternalLink>.
                  </p>
                </div>
              )}
            </ServersListGroup>
          </div>
        </Row>
      </Card>
    </div>
  );
};

export default Home;
