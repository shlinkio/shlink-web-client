import { faExternalLinkAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import { ExternalLink } from 'react-external-link';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'reactstrap';
import type { ServersMap } from '../servers/data';
import { ServersListGroup } from '../servers/ServersListGroup';
import { ShlinkLogo } from './img/ShlinkLogo';
import './Home.scss';

interface HomeProps {
  servers: ServersMap;
}

export const Home = ({ servers }: HomeProps) => {
  const navigate = useNavigate();
  const serversList = Object.values(servers);
  const hasServers = serversList.length > 0;

  useEffect(() => {
    // Try to redirect to the first server marked as auto-connect
    const autoConnectServer = serversList.find(({ autoConnect }) => autoConnect);
    if (autoConnectServer) {
      navigate(`/server/${autoConnectServer.id}`);
    }
  }, [serversList, navigate]);

  return (
    <div className="w-100">
      <Card className="mx-auto" style={{ maxWidth: '720px' }}>
        <div className="d-flex flex-column flex-md-row">
          <div className="p-4 d-none d-md-flex align-items-center" style={{ width: '40%' }}>
            <div className="w-100">
              <ShlinkLogo />
            </div>
          </div>

          <div className="home__servers-container flex-grow-1">
            <h1
              className={clsx('home__title p-4 text-center m-0', { 'border-bottom': !hasServers })}
              style={{ borderColor: 'var(--border-color) !important' }}
            >
              Welcome!
            </h1>
            <ServersListGroup embedded servers={serversList}>
              {!hasServers && (
                <div className="p-4 text-center d-flex flex-column gap-5">
                  <p className="mb-0">This application will help you manage your Shlink servers.</p>
                  <p className="mb-0">
                    <Link to="/server/create" className="btn btn-outline-primary btn-lg me-2">
                      <FontAwesomeIcon icon={faPlus}/> <span className="ms-1">Add a server</span>
                    </Link>
                  </p>
                  <p className="mb-0">
                    <ExternalLink href="https://shlink.io/documentation">
                      <small>
                        <span className="me-2">Learn more about Shlink</span>
                        <FontAwesomeIcon icon={faExternalLinkAlt}/>
                      </small>
                    </ExternalLink>
                  </p>
                </div>
              )}
            </ServersListGroup>
          </div>
        </div>
      </Card>
    </div>
  );
};
