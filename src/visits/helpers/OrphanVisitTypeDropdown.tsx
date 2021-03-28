import { DropdownItem } from 'reactstrap';
import { OrphanVisitType } from '../types';
import { DropdownBtn } from '../../utils/DropdownBtn';

interface OrphanVisitTypeDropdownProps {
  onChange: (type: OrphanVisitType | undefined) => void;
  selected?: OrphanVisitType | undefined;
  className?: string;
  text: string;
}

export const OrphanVisitTypeDropdown = ({ onChange, selected, text, className }: OrphanVisitTypeDropdownProps) => (
  <DropdownBtn text={text} dropdownClassName={className} className="mr-3" right>
    <DropdownItem active={selected === 'base_url'} onClick={() => onChange('base_url')}>
      Base URL
    </DropdownItem>
    <DropdownItem active={selected === 'invalid_short_url'} onClick={() => onChange('invalid_short_url')}>
      Invalid short URL
    </DropdownItem>
    <DropdownItem active={selected === 'regular_404'} onClick={() => onChange('regular_404')}>
      Regular 404
    </DropdownItem>
    <DropdownItem divider />
    <DropdownItem onClick={() => onChange(undefined)}><i>Clear selection</i></DropdownItem>
  </DropdownBtn>
);
