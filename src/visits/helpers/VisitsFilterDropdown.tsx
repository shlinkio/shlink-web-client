import { DropdownItem, DropdownItemProps } from 'reactstrap'; // eslint-disable-line import/named
import { OrphanVisitType } from '../types';
import { DropdownBtn } from '../../utils/DropdownBtn';
import { hasValue } from '../../utils/utils';

export interface VisitsFilter {
  orphanVisitsType?: OrphanVisitType | undefined;
  excludeBots?: boolean;
}

interface VisitsFilterDropdownProps {
  onChange: (filters: VisitsFilter) => void;
  selected?: VisitsFilter;
  className?: string;
  isOrphanVisits: boolean;
  botsSupported: boolean;
}

export const VisitsFilterDropdown = (
  { onChange, selected = {}, className, isOrphanVisits, botsSupported }: VisitsFilterDropdownProps,
) => {
  if (!botsSupported && !isOrphanVisits) {
    return null;
  }

  const { orphanVisitsType, excludeBots = false } = selected;
  const propsForOrphanVisitsTypeItem = (type: OrphanVisitType): DropdownItemProps => ({
    active: orphanVisitsType === type,
    onClick: () => onChange({ ...selected, orphanVisitsType: type }),
  });
  const onBotsClick = () => onChange({ ...selected, excludeBots: !selected?.excludeBots });

  return (
    <DropdownBtn text="Filters" dropdownClassName={className} className="mr-3" right minWidth={250}>
      {botsSupported && (
        <>
          <DropdownItem header>Bots:</DropdownItem>
          <DropdownItem active={excludeBots} onClick={onBotsClick}>Exclude potential bots</DropdownItem>
        </>
      )}

      {botsSupported && isOrphanVisits && <DropdownItem divider />}

      {isOrphanVisits && (
        <>
          <DropdownItem header>Orphan visits type:</DropdownItem>
          <DropdownItem {...propsForOrphanVisitsTypeItem('base_url')}>Base URL</DropdownItem>
          <DropdownItem {...propsForOrphanVisitsTypeItem('invalid_short_url')}>Invalid short URL</DropdownItem>
          <DropdownItem {...propsForOrphanVisitsTypeItem('regular_404')}>Regular 404</DropdownItem>
        </>
      )}

      <DropdownItem divider />
      <DropdownItem disabled={!hasValue(selected)} onClick={() => onChange({})}><i>Clear filters</i></DropdownItem>
    </DropdownBtn>
  );
};
