import { FC } from 'react';
import { Dropdown as BsDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { useToggle } from './helpers/hooks';
import './Dropdown.scss';

interface DropdownProps {
  text: string;
  disabled?: boolean;
  className?: string;
}

export const Dropdown: FC<DropdownProps> = ({ text, disabled = false, className, children }) => {
  const [ isOpen, toggle ] = useToggle();

  return (
    <BsDropdown isOpen={isOpen} toggle={toggle} disabled={disabled}>
      <DropdownToggle caret className={`dropdown__btn btn-block ${className}`} color="primary">{text}</DropdownToggle>
      <DropdownMenu className="w-100">{children}</DropdownMenu>
    </BsDropdown>
  );
};
