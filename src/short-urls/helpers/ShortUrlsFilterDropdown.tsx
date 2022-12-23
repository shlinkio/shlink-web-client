import { DropdownItem } from 'reactstrap';
import { DropdownBtn } from '../../utils/DropdownBtn';
import { hasValue } from '../../utils/utils';
import { ShortUrlsFilter } from '../data';

interface ShortUrlsFilterDropdownProps {
  onChange: (filters: ShortUrlsFilter) => void;
  selected?: ShortUrlsFilter;
  className?: string;
  botsSupported: boolean;
}

export const ShortUrlsFilterDropdown = (
  { onChange, selected = {}, className, botsSupported }: ShortUrlsFilterDropdownProps,
) => {
  if (!botsSupported) {
    return null;
  }

  const { excludeBots = false } = selected;
  const onBotsClick = () => onChange({ ...selected, excludeBots: !selected?.excludeBots });

  return (
    <DropdownBtn text="Filters" dropdownClassName={className} className="me-3" right minWidth={250}>
      {botsSupported && (
        <>
          <DropdownItem header>Bots:</DropdownItem>
          <DropdownItem active={excludeBots} onClick={onBotsClick}>Exclude bots visits</DropdownItem>
        </>
      )}

      <DropdownItem divider />
      <DropdownItem disabled={!hasValue(selected)} onClick={() => onChange({ excludeBots: false })}>
        <i>Clear filters</i>
      </DropdownItem>
    </DropdownBtn>
  );
};
