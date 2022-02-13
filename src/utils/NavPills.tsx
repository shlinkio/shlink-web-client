import { FC, ReactNode } from 'react';
import { Card, Nav, NavLink } from 'reactstrap';
import { NavLink as RouterNavLink } from 'react-router-dom';
import './NavPills.scss';

interface NavPillsProps {
  items: { children: ReactNode; to: string; replace?: boolean }[];
}

export const NavPills: FC<NavPillsProps> = ({ items }) => (
  <Card className="nav-pills__nav p-0 overflow-hidden mb-3" body>
    <Nav pills fill>
      {items.map(({ children, ...rest }, index) =>
        <NavLink key={index} className="nav-pills__nav-link" tag={RouterNavLink} {...rest}>{children}</NavLink>)}
    </Nav>
  </Card>
);
