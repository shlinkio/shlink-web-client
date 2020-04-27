import { isEmpty, values } from 'ramda';
import React from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import PropTypes from 'prop-types';
import { serverType } from './prop-types';

const ServersDropdown = (serversExporter) => class ServersDropdown extends React.Component {
  static propTypes = {
    servers: PropTypes.object,
    selectedServer: serverType,
    listServers: PropTypes.func,
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
  };

  renderServers = () => {
    const { servers, selectedServer } = this.props;
    const serversList = values(servers);
    const { push } = this.props.history;
    const loadServer = (id) => push(`/server/${id}/list-short-urls/1`);

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

  componentDidMount = this.props.listServers;

  render = () => (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>Servers</DropdownToggle>
      <DropdownMenu right>{this.renderServers()}</DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default ServersDropdown;
