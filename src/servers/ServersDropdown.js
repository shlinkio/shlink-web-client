import { isEmpty, values } from 'ramda';
import React from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import PropTypes from 'prop-types';
import { serverType } from './prop-types';

const propTypes = {
  servers: PropTypes.object,
  selectedServer: serverType,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

const ServersDropdown = (serversExporter) => {
  const ServersDropdownComp = ({ servers, selectedServer, history }) => {
    const serversList = values(servers);
    const loadServer = (id) => history.push(`/server/${id}/list-short-urls/1`);

    const renderServers = () => {
      if (isEmpty(serversList)) {
        return <DropdownItem disabled><i>Add a server first...</i></DropdownItem>;
      }

      return (
        <React.Fragment>
          {serversList.map(({ name, id }) => (
            <DropdownItem key={id} active={selectedServer && selectedServer.id === id} onClick={() => loadServer(id)}>
              {name}
            </DropdownItem>
          ))}
          <DropdownItem divider />
          <DropdownItem className="servers-dropdown__export-item" onClick={() => serversExporter.exportServers()}>
            Export servers
          </DropdownItem>
        </React.Fragment>
      );
    };

    return (
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret>Servers</DropdownToggle>
        <DropdownMenu right>{renderServers()}</DropdownMenu>
      </UncontrolledDropdown>
    );
  };

  ServersDropdownComp.propTypes = propTypes;

  return ServersDropdownComp;
};

export default ServersDropdown;
