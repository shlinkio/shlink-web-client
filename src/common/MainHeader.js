import plusIcon from '@fortawesome/fontawesome-free-solid/faPlus';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import ServersDropdown from '../servers/ServersDropdown';
import './MainHeader.scss';
import shlinkLogo from './shlink-logo-white.png';

export class MainHeader extends React.Component {
  state = { isOpen: false };
  toggle = () => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen
    }));
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <Navbar color="primary" dark fixed="top" className="main-header" expand="md">
        <NavbarBrand tag={Link} to="/">
          <img src={shlinkLogo} alt="Shlink" className="main-header__brand-logo"/> Shlink
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse navbar isOpen={this.state.isOpen}>
          <Nav navbar className="ml-auto">
            <NavItem>
              <NavLink tag={Link} to="/server/create">
                <FontAwesomeIcon icon={plusIcon}/>&nbsp; Add server
              </NavLink>
            </NavItem>
            <ServersDropdown />
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default withRouter(MainHeader);
