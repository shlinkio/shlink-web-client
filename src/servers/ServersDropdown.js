import { isEmpty, values } from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import PropTypes from 'prop-types';
import { serverType } from './prop-types';

const ServersDropdown = (serversExporter) => class ServersDropdown extends React.Component {
  static propTypes = {
    servers: PropTypes.object,
    selectedServer: serverType,
    selectServer: PropTypes.func,
    listServers: PropTypes.func,
  };

  renderServers = () => {
    const { servers: { list, loading }, selectedServer, selectServer } = this.props;
    const servers = values(list);

    if (loading) {
      return <DropdownItem disabled><i>Trying to load servers...</i></DropdownItem>;
    }

    if (isEmpty(servers)) {
      return <DropdownItem disabled><i>Add a server first...</i></DropdownItem>;
    }

    return (
      <React.Fragment>
        {servers.map(({ name, id }) => (
          <DropdownItem
            key={id}
            tag={Link}
            to={`/server/${id}/list-short-urls/1`}
            active={selectedServer && selectedServer.id === id}

            // FIXME This should be implicit
            onClick={() => selectServer(id)}
          >
            {name}
          </DropdownItem>
        ))}
        <DropdownItem divider />
        <DropdownItem
          className="servers-dropdown__export-item"
          onClick={() => serversExporter.exportServers()}
        >
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
