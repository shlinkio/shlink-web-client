import { FC, Children, isValidElement, PropsWithChildren } from 'react';
import { Card, Nav, NavLink } from 'reactstrap';
import { NavLink as RouterNavLink } from 'react-router-dom';
import './NavPills.scss';

type NavPillsProps = PropsWithChildren<{
  fill?: boolean;
  className?: string;
}>;

type NavPillProps = PropsWithChildren<{
  to: string;
  replace?: boolean;
}>;

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
