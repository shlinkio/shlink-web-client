import { FC } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { useToggle } from './helpers/hooks';
import './Dropdown.scss';

export interface DropdownBtnProps {
  text: string;
  disabled?: boolean;
  className?: string;
}

export const DropdownBtn: FC<DropdownBtnProps> = ({ text, disabled = false, className = '', children }) => {
  const [ isOpen, toggle ] = useToggle();
  const toggleClasses = `dropdown-btn__toggle btn-block ${className}`;

  return (
    <Dropdown isOpen={isOpen} toggle={toggle} disabled={disabled}>
      <DropdownToggle caret className={toggleClasses} color="primary">{text}</DropdownToggle>
      <DropdownMenu className="w-100">{children}</DropdownMenu>
    </Dropdown>
  );
};
