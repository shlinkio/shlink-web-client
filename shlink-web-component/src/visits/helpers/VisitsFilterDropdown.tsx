import { DropdownBtn } from '@shlinkio/shlink-frontend-kit';
import type { DropdownItemProps } from 'reactstrap';
import { DropdownItem } from 'reactstrap';
import { hasValue } from '../../utils/helpers';
import type { OrphanVisitType, VisitsFilter } from '../types';

interface VisitsFilterDropdownProps {
  onChange: (filters: VisitsFilter) => void;
  selected?: VisitsFilter;
  className?: string;
  isOrphanVisits: boolean;
}

export const VisitsFilterDropdown = (
  { onChange, selected = {}, className, isOrphanVisits }: VisitsFilterDropdownProps,
) => {
  const { orphanVisitsType, excludeBots = false } = selected;
  const propsForOrphanVisitsTypeItem = (type: OrphanVisitType): DropdownItemProps => ({
    active: orphanVisitsType === type,
    onClick: () => onChange({ ...selected, orphanVisitsType: type === selected?.orphanVisitsType ? undefined : type }),
  });
  const onBotsClick = () => onChange({ ...selected, excludeBots: !selected?.excludeBots });

  return (
    <DropdownBtn text="Filters" dropdownClassName={className} inline end minWidth={250}>
      <DropdownItem header>Bots:</DropdownItem>
      <DropdownItem active={excludeBots} onClick={onBotsClick}>Exclude potential bots</DropdownItem>

      {isOrphanVisits && (
        <>
          <DropdownItem divider />
          <DropdownItem header>Orphan visits type:</DropdownItem>
          <DropdownItem {...propsForOrphanVisitsTypeItem('base_url')}>Base URL</DropdownItem>
          <DropdownItem {...propsForOrphanVisitsTypeItem('invalid_short_url')}>Invalid short URL</DropdownItem>
          <DropdownItem {...propsForOrphanVisitsTypeItem('regular_404')}>Regular 404</DropdownItem>
        </>
      )}

      <DropdownItem divider />
      <DropdownItem
        disabled={!hasValue(selected)}
        onClick={() => onChange({ excludeBots: false, orphanVisitsType: undefined })}
      >
        <i>Clear filters</i>
      </DropdownItem>
    </DropdownBtn>
  );
};
