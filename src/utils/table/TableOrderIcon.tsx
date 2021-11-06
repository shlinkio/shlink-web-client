import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown as caretDownIcon, faCaretUp as caretUpIcon } from '@fortawesome/free-solid-svg-icons';
import { Order } from '../helpers/ordering';

interface TableOrderIconProps<T> {
  currentOrder: Order<T>;
  field: T;
  className?: string;
}

export function TableOrderIcon<T extends string = string>(
  { currentOrder, field, className = 'ml-1' }: TableOrderIconProps<T>,
) {
  if (!currentOrder.dir || currentOrder.field !== field) {
    return null;
  }

  return <FontAwesomeIcon icon={currentOrder.dir === 'ASC' ? caretUpIcon : caretDownIcon} className={className} />;
}
