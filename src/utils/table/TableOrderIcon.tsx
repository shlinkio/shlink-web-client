import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown as caretDownIcon, faCaretUp as caretUpIcon } from '@fortawesome/free-solid-svg-icons';
import type { Order } from '../helpers/ordering';

interface TableOrderIconProps<T> {
  currentOrder: Order<T>;
  field: T;
  className?: string;
}

export function TableOrderIcon<T extends string = string>(
  { currentOrder, field, className = 'ms-1' }: TableOrderIconProps<T>,
) {
  if (!currentOrder.dir || currentOrder.field !== field) {
    return null;
  }

  return <FontAwesomeIcon icon={currentOrder.dir === 'ASC' ? caretUpIcon : caretDownIcon} className={className} />;
}
