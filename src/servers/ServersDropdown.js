import React from 'react';
import { connect } from 'react-redux';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { isEmpty } from 'ramda';

import { listServers } from './reducers/server';
import { loadServer } from './reducers/selectedServer';

export class ServersDropdown extends React.Component {
  renderServers = () => {
    const { servers } = this.props;

    if (isEmpty(servers)) {
      return <DropdownItem disabled><i>Add a server first...</i></DropdownItem>
    }

    return Object.values(servers).map(({ name, id }) => (
      <span key={id}>
        <DropdownItem onClick={() => this.selectServer(id)}>
          {name}
        </DropdownItem>
      </span>
    ));
  };

  selectServer = serverId => {
    this.props.loadServer(serverId);
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
  servers: state.servers
});

export default connect(mapStateToProps, { listServers, loadServer })(ServersDropdown);
