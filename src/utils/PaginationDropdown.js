import React from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import * as PropTypes from 'prop-types';

const propTypes = {
  toggleClassName: PropTypes.string,
  ranges: PropTypes.arrayOf(PropTypes.number).isRequired,
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
};

const PaginationDropdown = ({ toggleClassName, ranges, value, setValue }) => (
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

PaginationDropdown.propTypes = propTypes;

export default PaginationDropdown;
