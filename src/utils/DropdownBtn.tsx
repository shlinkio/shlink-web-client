import { FC } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { useToggle } from './helpers/hooks';
import './DropdownBtn.scss';

export interface DropdownBtnProps {
  text: string;
  disabled?: boolean;
  className?: string;
  dropdownClassName?: string;
  right?: boolean;
}

export const DropdownBtn: FC<DropdownBtnProps> = (
  { text, disabled = false, className = '', children, dropdownClassName, right = false },
) => {
  const [ isOpen, toggle ] = useToggle();
  const toggleClasses = `dropdown-btn__toggle btn-block ${className}`;

  return (
    <Dropdown isOpen={isOpen} toggle={toggle} disabled={disabled} className={dropdownClassName}>
      <DropdownToggle caret className={toggleClasses} color="primary">{text}</DropdownToggle>
      <DropdownMenu className="w-100" right={right}>{children}</DropdownMenu>
    </Dropdown>
  );
};
