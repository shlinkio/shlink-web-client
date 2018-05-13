import React from 'react';
import './MainHeader.scss';
import {Navbar, NavbarBrand} from 'reactstrap';
import shlinkLogo from './shlink-logo-white.png';

export default class MainHeader extends React.Component {
    render() {
        return (
            <Navbar light fixed="top" className="main-header">
                <NavbarBrand href="https://shlink.io" className="mr-auto">
                    <img src={shlinkLogo} alt="Shlink" className="main-header__brand-logo" /> Shlink
                </NavbarBrand>
            </Navbar>
        );
    }
}
