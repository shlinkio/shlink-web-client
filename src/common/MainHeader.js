import plusIcon from '@fortawesome/fontawesome-free-solid/faPlus';
import arrowIcon from '@fortawesome/fontawesome-free-solid/faChevronDown';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ServersDropdown from '../servers/ServersDropdown';
import './MainHeader.scss';
import shlinkLogo from './shlink-logo-white.png';

const propTypes = {
  location: PropTypes.object,
};

export class MainHeaderComponent extends React.Component {
  state = { isOpen: false };
  handleToggle = () => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen,
    }));
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    const { location } = this.props;
    const createServerPath = '/server/create';
    const toggleClass = classnames('main-header__toggle-icon', {
      'main-header__toggle-icon--opened': this.state.isOpen,
    });

    return (
      <Navbar color="primary" dark fixed="top" className="main-header" expand="md">
        <NavbarBrand tag={Link} to="/">
          <img src={shlinkLogo} alt="Shlink" className="main-header__brand-logo" /> Shlink
        </NavbarBrand>

        <NavbarToggler onClick={this.handleToggle}>
          <FontAwesomeIcon icon={arrowIcon} className={toggleClass} />
        </NavbarToggler>

        <Collapse navbar isOpen={this.state.isOpen}>
          <Nav navbar className="ml-auto">
            <NavItem>
              <NavLink
                tag={Link}
                to={createServerPath}
                active={location.pathname === createServerPath}
              >
                <FontAwesomeIcon icon={plusIcon} />&nbsp; Add server
              </NavLink>
            </NavItem>
            <ServersDropdown />
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

MainHeaderComponent.propTypes = propTypes;

const MainHeader = withRouter(MainHeaderComponent);

export default MainHeader;
