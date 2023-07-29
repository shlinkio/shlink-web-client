import { DropdownItem } from 'reactstrap';
import { DropdownBtn } from '../../../src/utils/DropdownBtn';
import { hasValue } from '../../utils/helpers';
import type { ShortUrlsFilter } from '../data';

interface ShortUrlsFilterDropdownProps {
  onChange: (filters: ShortUrlsFilter) => void;
  supportsDisabledFiltering: boolean;
  selected?: ShortUrlsFilter;
  className?: string;
}

export const ShortUrlsFilterDropdown = (
  { onChange, selected = {}, className, supportsDisabledFiltering }: ShortUrlsFilterDropdownProps,
) => {
  const { excludeBots = false, excludeMaxVisitsReached = false, excludePastValidUntil = false } = selected;
  const onFilterClick = (key: keyof ShortUrlsFilter) => () => onChange({ ...selected, [key]: !selected?.[key] });

  return (
    <DropdownBtn text="Filters" dropdownClassName={className} inline end minWidth={250}>
      <DropdownItem header>Visits:</DropdownItem>
      <DropdownItem active={excludeBots} onClick={onFilterClick('excludeBots')}>Ignore visits from bots</DropdownItem>

      {supportsDisabledFiltering && (
        <>
          <DropdownItem divider />
          <DropdownItem header>Short URLs:</DropdownItem>
          <DropdownItem active={excludeMaxVisitsReached} onClick={onFilterClick('excludeMaxVisitsReached')}>
            Exclude with visits reached
          </DropdownItem>
          <DropdownItem active={excludePastValidUntil} onClick={onFilterClick('excludePastValidUntil')}>
            Exclude enabled in the past
          </DropdownItem>
        </>
      )}

      <DropdownItem divider />
      <DropdownItem
        disabled={!hasValue(selected)}
        onClick={() => onChange({ excludeBots: false, excludeMaxVisitsReached: false, excludePastValidUntil: false })}
      >
        <i>Clear filters</i>
      </DropdownItem>
    </DropdownBtn>
  );
};
