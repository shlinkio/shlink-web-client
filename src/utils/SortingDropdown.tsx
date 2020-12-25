import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { toPairs } from 'ramda';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAmountUp as sortAscIcon, faSortAmountDown as sortDescIcon } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { determineOrderDir, OrderDir } from './utils';
import './SortingDropdown.scss';

export interface SortingDropdownProps<T extends string = string> {
  items: Record<T, string>;
  orderField?: T;
  orderDir?: OrderDir;
  onChange: (orderField?: T, orderDir?: OrderDir) => void;
  isButton?: boolean;
  right?: boolean;
}

export default function SortingDropdown<T extends string = string>(
  { items, orderField, orderDir, onChange, isButton = true, right = false }: SortingDropdownProps<T>,
) {
  const handleItemClick = (fieldKey: T) => () => {
    const newOrderDir = determineOrderDir(fieldKey, orderField, orderDir);

    onChange(newOrderDir ? fieldKey : undefined, newOrderDir);
  };

  return (
    <UncontrolledDropdown>
      <DropdownToggle
        caret
        color={isButton ? 'primary' : 'link'}
        className={classNames({ 'dropdown-btn__toggle btn-block': isButton, 'btn-sm p-0': !isButton })}
      >
        {!isButton && <>Order by</>}
        {isButton && !orderField && <>Order by...</>}
        {isButton && orderField && `Order by: "${items[orderField]}" - "${orderDir ?? 'DESC'}"`}
      </DropdownToggle>
      <DropdownMenu
        right={right}
        className={classNames('w-100', { 'sorting-dropdown__menu--link': !isButton })}
      >
        {toPairs(items).map(([ fieldKey, fieldValue ]) => (
          <DropdownItem key={fieldKey} active={orderField === fieldKey} onClick={handleItemClick(fieldKey as T)}>
            {fieldValue}
            {orderField === fieldKey && (
              <FontAwesomeIcon
                icon={orderDir === 'ASC' ? sortAscIcon : sortDescIcon}
                className="sorting-dropdown__sort-icon"
              />
            )}
          </DropdownItem>
        ))}
        <DropdownItem divider />
        <DropdownItem disabled={!orderField} onClick={() => onChange()}>
          <i>Clear selection</i>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}
