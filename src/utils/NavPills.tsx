import { FC, Children, isValidElement } from 'react';
import { Card, Nav, NavLink } from 'reactstrap';
import { NavLink as RouterNavLink } from 'react-router-dom';
import './NavPills.scss';

interface NavPillsProps {
  fill?: boolean;
  className?: string;
}

interface NavPillProps {
  to: string;
  replace?: boolean;
}

export const NavPillItem: FC<NavPillProps> = ({ children, ...rest }) => (
  <NavLink className="nav-pills__nav-link" tag={RouterNavLink} {...rest}>
    {children}
  </NavLink>
);

export const NavPills: FC<NavPillsProps> = ({ children, fill = false, className = '' }) => (
  <Card className={`nav-pills__nav p-0 overflow-hidden ${className}`} body>
    <Nav pills fill={fill}>
      {Children.map(children, (child) => {
        if (!isValidElement(child) || child.type !== NavPillItem) {
          throw new Error('Only NavPillItem children are allowed inside NavPills.');
        }

        return child;
      })}
    </Nav>
  </Card>
);
