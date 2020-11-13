import { isEmpty, values } from 'ramda';
import { Link } from 'react-router-dom';
import ServersListGroup from '../servers/ServersListGroup';
import './Home.scss';
import { ServersMap } from '../servers/data';

export interface HomeProps {
  servers: ServersMap;
}

const Home = ({ servers }: HomeProps) => {
  const serversList = values(servers);
  const hasServers = !isEmpty(serversList);

  return (
    <div className="home">
      <h1 className="home__title">Welcome to Shlink</h1>
      <ServersListGroup servers={serversList}>
        {hasServers && <span>Please, select a server.</span>}
        {!hasServers && <span>Please, <Link to="/server/create">add a server</Link>.</span>}
      </ServersListGroup>
    </div>
  );
};

export default Home;
