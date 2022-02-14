import { FC, Children, isValidElement } from 'react';
import { Card, Nav, NavLink } from 'reactstrap';
import { NavLink as RouterNavLink } from 'react-router-dom';
import './NavPills.scss';

interface NavPillProps {
  to: string;
  replace?: boolean;
}

export const NavPillItem: FC<NavPillProps> = ({ children, ...rest }) => (
  <NavLink className="nav-pills__nav-link" tag={RouterNavLink} {...rest}>
    {children}
  </NavLink>
);

export const NavPills: FC = ({ children }) => (
  <Card className="nav-pills__nav p-0 overflow-hidden mb-3" body>
    <Nav pills fill>
      {Children.map(children, (child) => {
        if (!isValidElement(child) || child.type !== NavPillItem) {
          throw new Error('Only NavPillItem children are allowed inside NavPills.');
        }

        return child;
      })}
    </Nav>
  </Card>
);
