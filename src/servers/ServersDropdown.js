import { isEmpty, pick } from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

import { listServers } from './reducers/server';
import { selectServer } from '../servers/reducers/selectedServer';

export class ServersDropdown extends React.Component {
  renderServers = () => {
    const { servers, selectedServer, selectServer } = this.props;

    if (isEmpty(servers)) {
      return <DropdownItem disabled><i>Add a server first...</i></DropdownItem>
    }

    return Object.values(servers).map(({ name, id }) => (
      <span key={id}>
        <DropdownItem
          tag={Link}
          to={`/server/${id}/list-short-urls/1`}
          active={selectedServer && selectedServer.id === id}
          onClick={() => selectServer(id)} // FIXME This should be implicit
        >
          {name}
        </DropdownItem>
      </span>
    ));
  };

  componentDidMount() {
    this.props.listServers();
  }

  render() {
    return (
      <UncontrolledDropdown nav>
        <DropdownToggle nav caret>Servers</DropdownToggle>
        <DropdownMenu>{this.renderServers()}</DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}

export default connect(pick(['servers', 'selectedServer']), { listServers, selectServer })(ServersDropdown);
