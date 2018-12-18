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
    const { servers, selectedServer, selectServer } = this.props;

    if (isEmpty(servers)) {
      return <DropdownItem disabled><i>Add a server first...</i></DropdownItem>;
    }

    return (
      <React.Fragment>
        {values(servers).map(({ name, id }) => (
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

  componentDidMount() {
    this.props.listServers();
  }

  render() {
    return (
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret>Servers</DropdownToggle>
        <DropdownMenu right>{this.renderServers()}</DropdownMenu>
      </UncontrolledDropdown>
    );
  }
};

export default ServersDropdown;
