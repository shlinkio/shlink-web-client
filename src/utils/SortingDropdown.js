import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { toPairs } from 'ramda';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import caretUpIcon from '@fortawesome/fontawesome-free-solid/faCaretUp';
import caretDownIcon from '@fortawesome/fontawesome-free-solid/faCaretDown';
import classNames from 'classnames';
import { determineOrderDir } from '../utils/utils';
import './SortingDropdown.scss';

const propTypes = {
  items: PropTypes.object.isRequired,
  orderField: PropTypes.string,
  orderDir: PropTypes.oneOf([ 'ASC', 'DESC' ]),
  onChange: PropTypes.func.isRequired,
  isButton: PropTypes.bool,
  right: PropTypes.bool,
};
const defaultProps = {
  isButton: true,
  right: false,
};

const SortingDropdown = ({ items, orderField, orderDir, onChange, isButton, right }) => {
  const handleItemClick = (fieldKey) => () => {
    const newOrderDir = determineOrderDir(fieldKey, orderField, orderDir);

    onChange(newOrderDir ? fieldKey : undefined, newOrderDir);
  };

  return (
    <UncontrolledDropdown>
      <DropdownToggle
        caret
        color={isButton ? 'secondary' : 'link'}
        className={classNames({ 'btn-block': isButton, 'btn-sm sorting-dropdown__paddingless': !isButton })}
      >
        Order by
      </DropdownToggle>
      <DropdownMenu
        right={right}
        className={classNames('sorting-dropdown__menu', { 'sorting-dropdown__menu--link': !isButton })}
      >
        {toPairs(items).map(([ fieldKey, fieldValue ]) => (
          <DropdownItem key={fieldKey} active={orderField === fieldKey} onClick={handleItemClick(fieldKey)}>
            {fieldValue}
            {orderField === fieldKey && (
              <FontAwesomeIcon
                icon={orderDir === 'ASC' ? caretUpIcon : caretDownIcon}
                className="sorting-dropdown__sort-icon"
              />
            )}
          </DropdownItem>
        ))}
        <DropdownItem divider />
        <DropdownItem onClick={() => onChange()}>
          <i>Clear selection</i>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

SortingDropdown.propTypes = propTypes;
SortingDropdown.defaultProps = defaultProps;

export default SortingDropdown;
