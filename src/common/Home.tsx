import { faExternalLinkAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card } from '@shlinkio/shlink-frontend-kit/tailwind';
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
    <div className="tw:px-3 tw:w-full">
      <Card className="tw:mx-auto tw:max-w-[720px] tw:overflow-hidden">
        <div className="tw:flex tw:flex-col tw:md:flex-row">
          <div className="tw:p-6 tw:hidden tw:md:flex tw:items-center tw:w-[40%]">
            <div className="tw:w-full">
              <ShlinkLogo />
            </div>
          </div>

          <div className="tw:md:border-l tw:border-lm-border tw:dark:border-dm-border tw:flex-grow">
            <h1
              className={clsx(
                'tw:p-4 tw:text-center tw:border-lm-border tw:dark:border-dm-border',
                { 'tw:border-b': !hasServers },
              )}
            >
              Welcome!
            </h1>
            {hasServers ? <ServersListGroup servers={serversList} /> : (
              <div className="tw:p-6 tw:text-center tw:flex tw:flex-col tw:gap-12 tw:text-xl">
                <p>This application will help you manage your Shlink servers.</p>
                <p>
                  <Button to="/server/create" size="lg" inline>
                    <FontAwesomeIcon icon={faPlus} /> Add a server
                  </Button>
                </p>
                <p>
                  <ExternalLink href="https://shlink.io/documentation">
                    <small>
                      <span className="tw:mr-2">Learn more about Shlink</span>
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
