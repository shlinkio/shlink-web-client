import { useEffect } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupAddon,
  InputProps,
  UncontrolledTooltip,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { isEmpty, pipe } from 'ramda';
import { useToggle } from '../utils/helpers/hooks';
import { DomainsList } from './reducers/domainsList';
import './DomainsDropdown.scss';

export interface DomainsDropdownProps extends Omit<InputProps, 'onChange'> {
  value?: string;
  onChange: (domain?: string) => void;
}

interface DomainsDropdownConnectProps extends DomainsDropdownProps {
  listDomains: Function;
  domainsList: DomainsList;
}

export const DomainsDropdown = ({ listDomains, value, domainsList, onChange }: DomainsDropdownConnectProps) => {
  const [ inputDisplayed,, showInput, hideInput ] = useToggle();
  const [ isDropdownOpen, toggleDropdown ] = useToggle();
  const { domains } = domainsList;
  const defaultDomain = domains.find(({ isDefault }) => isDefault);
  const valueIsEmpty = isEmpty(value);
  const unselectDomain = () => onChange('');

  useEffect(() => {
    listDomains();
  }, []);

  return inputDisplayed ? (
    <InputGroup>
      <Input
        value={value}
        placeholder="Domain"
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon addonType="append">
        <Button id="backToDropdown" outline type="button" onClick={pipe(unselectDomain, hideInput)}>
          <FontAwesomeIcon icon={faUndo} />
        </Button>
        <UncontrolledTooltip target="backToDropdown" placement="left" trigger="hover">
          Existing domains
        </UncontrolledTooltip>
      </InputGroupAddon>
    </InputGroup>
  ) : (
    <Dropdown isOpen={isDropdownOpen} toggle={toggleDropdown}>
      <DropdownToggle caret className="domains-dropdown__toggle-btn btn-block">
        Domain: {valueIsEmpty ? defaultDomain?.domain : value}
      </DropdownToggle>
      <DropdownMenu className="domains-dropdown__menu">
        {domains.map(({ domain, isDefault }) => (
          <DropdownItem
            key={domain}
            active={value === domain || isDefault && valueIsEmpty}
            onClick={() => onChange(domain)}
          >
            {domain}
            {isDefault && <span className="float-right text-muted">default</span>}
          </DropdownItem>
        ))}
        <DropdownItem divider />
        <DropdownItem onClick={pipe(unselectDomain, showInput)}>
          <i>New domain</i>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
