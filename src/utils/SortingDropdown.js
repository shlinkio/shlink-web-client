import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { toPairs } from 'ramda';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import caretUpIcon from '@fortawesome/fontawesome-free-solid/faCaretUp';
import caretDownIcon from '@fortawesome/fontawesome-free-solid/faCaretDown';
import { determineOrderDir } from '../utils/utils';
import './SortingDropdown.scss';

const propTypes = {
  items: PropTypes.object,
  orderField: PropTypes.string,
  orderDir: PropTypes.oneOf([ 'ASC', 'DESC' ]),
  onChange: PropTypes.func,
};

const SortingDropdown = ({ items, orderField, orderDir, onChange }) => (
  <UncontrolledDropdown>
    <DropdownToggle caret className="btn-block">Order by</DropdownToggle>
    <DropdownMenu className="sorting-dropdown__menu">
      {toPairs(items).map(([ fieldKey, fieldValue ]) => (
        <DropdownItem
          key={fieldKey}
          active={orderField === fieldKey}
          onClick={() => onChange(fieldKey, determineOrderDir(fieldKey, orderField, orderDir))}
        >
          {fieldValue}
          {orderField === fieldKey && (
            <FontAwesomeIcon
              icon={orderDir === 'ASC' ? caretUpIcon : caretDownIcon}
              className="sorting-dropdown__sort-icon"
            />
          )}
        </DropdownItem>
      ))}
    </DropdownMenu>
  </UncontrolledDropdown>
);

SortingDropdown.propTypes = propTypes;

export default SortingDropdown;
