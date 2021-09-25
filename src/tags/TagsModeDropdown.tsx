import { FC } from 'react';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars as listIcon, faThLarge as cardsIcon } from '@fortawesome/free-solid-svg-icons';
import { DropdownBtn } from '../utils/DropdownBtn';
import { TagsMode } from '../settings/reducers/settings';

interface TagsModeDropdownProps {
  mode: TagsMode;
  onChange: (newMode: TagsMode) => void;
  renderTitle?: (mode: TagsMode) => string;
}

export const TagsModeDropdown: FC<TagsModeDropdownProps> = ({ mode, onChange, renderTitle }) => (
  <DropdownBtn text={renderTitle?.(mode) ?? `Display mode: ${mode}`}>
    <DropdownItem outline active={mode === 'cards'} onClick={() => onChange('cards')}>
      <FontAwesomeIcon icon={cardsIcon} fixedWidth className="mr-1" /> Cards
    </DropdownItem>
    <DropdownItem outline active={mode === 'list'} onClick={() => onChange('list')}>
      <FontAwesomeIcon icon={listIcon} fixedWidth className="mr-1" /> List
    </DropdownItem>
  </DropdownBtn>
);
