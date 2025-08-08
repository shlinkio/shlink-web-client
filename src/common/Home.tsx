import { faExternalLinkAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card } from '@shlinkio/shlink-frontend-kit';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import { ExternalLink } from 'react-external-link';
import { useNavigate } from 'react-router';
import type { ServersMap } from '../servers/data';
import { ServersListGroup } from '../servers/ServersListGroup';
import { ShlinkLogo } from './img/ShlinkLogo';

export type HomeProps = {
  servers: ServersMap;
};

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
    <div className="px-3 w-full">
      <Card className="mx-auto max-w-[720px] overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 hidden md:flex items-center w-[40%]">
            <div className="w-full">
              <ShlinkLogo />
            </div>
          </div>

          <div className="md:border-l border-lm-border dark:border-dm-border flex-grow">
            <h1
              className={clsx(
                'p-4 text-center border-lm-border dark:border-dm-border',
                { 'border-b': !hasServers },
              )}
            >
              Welcome!
            </h1>
            {hasServers ? <ServersListGroup servers={serversList} /> : (
              <div className="p-6 text-center flex flex-col gap-12 text-xl">
                <p>This application will help you manage your Shlink servers.</p>
                <p>
                  <Button to="/server/create" size="lg" inline>
                    <FontAwesomeIcon icon={faPlus} widthAuto /> Add a server
                  </Button>
                </p>
                <p>
                  <ExternalLink href="https://shlink.io/documentation">
                    <small>
                      <span className="mr-2">Learn more about Shlink</span>
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </small>
                  </ExternalLink>
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
