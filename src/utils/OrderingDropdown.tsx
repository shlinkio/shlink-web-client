import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { toPairs } from 'ramda';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAmountUp as sortAscIcon, faSortAmountDown as sortDescIcon } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { determineOrderDir, Order, OrderDir } from './helpers/ordering';
import './OrderingDropdown.scss';

export interface OrderingDropdownProps<T extends string = string> {
  items: Record<T, string>;
  order: Order<T>;
  onChange: (orderField?: T, orderDir?: OrderDir) => void;
  isButton?: boolean;
  right?: boolean;
}

export function OrderingDropdown<T extends string = string>(
  { items, order, onChange, isButton = true, right = false }: OrderingDropdownProps<T>,
) {
  const handleItemClick = (fieldKey: T) => () => {
    const newOrderDir = determineOrderDir(fieldKey, order.field, order.dir);

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
        {isButton && !order.field && <>Order by...</>}
        {isButton && order.field && `Order by: "${items[order.field]}" - "${order.dir ?? 'DESC'}"`}
      </DropdownToggle>
      <DropdownMenu
        right={right}
        className={classNames('w-100', { 'ordering-dropdown__menu--link': !isButton })}
      >
        {toPairs(items).map(([ fieldKey, fieldValue ]) => (
          <DropdownItem key={fieldKey} active={order.field === fieldKey} onClick={handleItemClick(fieldKey as T)}>
            {fieldValue}
            {order.field === fieldKey && (
              <FontAwesomeIcon
                icon={order.dir === 'ASC' ? sortAscIcon : sortDescIcon}
                className="ordering-dropdown__sort-icon"
              />
            )}
          </DropdownItem>
        ))}
        <DropdownItem divider />
        <DropdownItem disabled={!order.field} onClick={() => onChange()}>
          <i>Clear selection</i>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}
