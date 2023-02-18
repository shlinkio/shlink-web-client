import { useEffect } from 'react';
import type { InputProps } from 'reactstrap';
import { Button, DropdownItem, Input, InputGroup, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { isEmpty, pipe } from 'ramda';
import { DropdownBtn } from '../utils/DropdownBtn';
import { useToggle } from '../utils/helpers/hooks';
import type { DomainsList } from './reducers/domainsList';
import './DomainSelector.scss';

export interface DomainSelectorProps extends Omit<InputProps, 'onChange'> {
  value?: string;
  onChange: (domain: string) => void;
}

interface DomainSelectorConnectProps extends DomainSelectorProps {
  listDomains: Function;
  domainsList: DomainsList;
}

export const DomainSelector = ({ listDomains, value, domainsList, onChange }: DomainSelectorConnectProps) => {
  const [inputDisplayed,, showInput, hideInput] = useToggle();
  const { domains } = domainsList;
  const valueIsEmpty = isEmpty(value);
  const unselectDomain = () => onChange('');

  useEffect(() => {
    listDomains();
  }, []);

  return inputDisplayed ? (
    <InputGroup>
      <Input
        value={value ?? ''}
        placeholder="Domain"
        onChange={(e) => onChange(e.target.value)}
      />
      <Button
        id="backToDropdown"
        outline
        type="button"
        className="domains-dropdown__back-btn"
        aria-label="Back to domains list"
        onClick={pipe(unselectDomain, hideInput)}
      >
        <FontAwesomeIcon icon={faUndo} />
      </Button>
      <UncontrolledTooltip target="backToDropdown" placement="left" trigger="hover">
        Existing domains
      </UncontrolledTooltip>
    </InputGroup>
  ) : (
    <DropdownBtn
      text={valueIsEmpty ? 'Domain' : `Domain: ${value}`}
      className={!valueIsEmpty ? 'domains-dropdown__toggle-btn--active' : 'domains-dropdown__toggle-btn'}
    >
      {domains.map(({ domain, isDefault }) => (
        <DropdownItem
          key={domain}
          active={(value === domain || isDefault) && valueIsEmpty}
          onClick={() => onChange(domain)}
        >
          {domain}
          {isDefault && <span className="float-end text-muted">default</span>}
        </DropdownItem>
      ))}
      <DropdownItem divider />
      <DropdownItem onClick={pipe(unselectDomain, showInput)}>
        <i>New domain</i>
      </DropdownItem>
    </DropdownBtn>
  );
};
