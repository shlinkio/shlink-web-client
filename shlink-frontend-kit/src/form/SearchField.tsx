import { faSearch as searchIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useState } from 'react';
import './SearchField.scss';

const DEFAULT_SEARCH_INTERVAL = 500;
let timer: NodeJS.Timeout | null;

interface SearchFieldProps {
  onChange: (value: string) => void;
  className?: string;
  large?: boolean;
  noBorder?: boolean;
  initialValue?: string;
}

export const SearchField = ({ onChange, className, large = true, noBorder = false, initialValue = '' }: SearchFieldProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const resetTimer = () => {
    timer && clearTimeout(timer);
    timer = null;
  };
  const searchTermChanged = (newSearchTerm: string, timeout = DEFAULT_SEARCH_INTERVAL) => {
    setSearchTerm(newSearchTerm);

    resetTimer();

    timer = setTimeout(() => {
      onChange(newSearchTerm);
      resetTimer();
    }, timeout);
  };

  return (
    <div className={classNames('search-field', className)}>
      <input
        type="text"
        className={classNames('form-control search-field__input', {
          'form-control-lg': large,
          'search-field__input--no-border': noBorder,
        })}
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => searchTermChanged(e.target.value)}
      />
      <FontAwesomeIcon icon={searchIcon} className="search-field__icon" />
      <div
        className="close search-field__close btn-close"
        hidden={searchTerm === ''}
        id="search-field__close"
        onClick={() => searchTermChanged('', 0)}
      />
    </div>
  );
};
