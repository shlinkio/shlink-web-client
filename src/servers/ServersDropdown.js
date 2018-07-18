import { isEmpty } from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

import { listServers } from './reducers/server';

export class ServersDropdown extends React.Component {
  renderServers = () => {
    const { servers, currentServer } = this.props;

    if (isEmpty(servers)) {
      return <DropdownItem disabled><i>Add a server first...</i></DropdownItem>
    }

    return Object.values(servers).map(({ name, id }) => (
      <span key={id}>
        <DropdownItem
          tag={Link}
          to={`/server/${id}/list-short-urls/1`}
          active={currentServer && currentServer.id === id}
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

const mapStateToProps = state => ({
  servers: state.servers,
  currentServer: state.selectedServer,
});

export default connect(mapStateToProps, { listServers })(ServersDropdown);
