import React from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

interface PaginationDropdownProps {
  ranges: number[];
  value: number;
  setValue: (newValue: number) => void;
  toggleClassName?: string;
}

const PaginationDropdown = ({ toggleClassName, ranges, value, setValue }: PaginationDropdownProps) => (
  <UncontrolledDropdown>
    <DropdownToggle caret color="link" className={toggleClassName}>
      Paginate
    </DropdownToggle>
    <DropdownMenu right>
      {ranges.map((itemsPerPage) => (
        <DropdownItem key={itemsPerPage} active={itemsPerPage === value} onClick={() => setValue(itemsPerPage)}>
          <b>{itemsPerPage}</b> items per page
        </DropdownItem>
      ))}
      <DropdownItem divider />
      <DropdownItem disabled={value === Infinity} onClick={() => setValue(Infinity)}>
        <i>Clear pagination</i>
      </DropdownItem>
    </DropdownMenu>
  </UncontrolledDropdown>
);

export default PaginationDropdown;
