import { isEmpty, pick, values } from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

import { listServers } from './reducers/server';
import { selectServer } from '../servers/reducers/selectedServer';
import serversExporter from '../servers/services/ServersExporter';

const defaultProps = {
  serversExporter,
};

export class ServersDropdown extends React.Component {
  renderServers = () => {
    const { servers, selectedServer, selectServer, serversExporter } = this.props;

    if (isEmpty(servers)) {
      return <DropdownItem disabled><i>Add a server first...</i></DropdownItem>
    }

    return (
      <React.Fragment>
        {values(servers).map(({ name, id }) => (
          <DropdownItem
            key={id}
            tag={Link}
            to={`/server/${id}/list-short-urls/1`}
            active={selectedServer && selectedServer.id === id}
            onClick={() => selectServer(id)} // FIXME This should be implicit
          >
            {name}
          </DropdownItem>
        ))}
        <DropdownItem divider />
        <DropdownItem
          onClick={serversExporter.exportServers}
          className="servers-dropdown__export-item"
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
}

ServersDropdown.defaultProps = defaultProps;

export default connect(
  pick(['servers', 'selectedServer']),
  { listServers, selectServer }
)(ServersDropdown);
