import { fireEvent, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { SelectedServer } from '../../src/servers/data';
import type { ShortUrlsOrderableFields } from '../../src/shlink-web-component/short-urls/data';
import { SHORT_URLS_ORDERABLE_FIELDS } from '../../src/shlink-web-component/short-urls/data';
import type { ShortUrlsList } from '../../src/shlink-web-component/short-urls/reducers/shortUrlsList';
import { ShortUrlsTable as shortUrlsTableCreator } from '../../src/shlink-web-component/short-urls/ShortUrlsTable';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<ShortUrlsTable />', () => {
  const shortUrlsList = fromPartial<ShortUrlsList>({});
  const orderByColumn = vi.fn();
  const ShortUrlsTable = shortUrlsTableCreator(() => <span>ShortUrlsRow</span>);
  const setUp = (server: SelectedServer = null) => renderWithEvents(
    <ShortUrlsTable shortUrlsList={shortUrlsList} selectedServer={server} orderByColumn={() => orderByColumn} />,
  );

  it('should render inner table by default', () => {
    setUp();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render row groups by default', () => {
    setUp();
    expect(screen.getAllByRole('rowgroup')).toHaveLength(2);
  });

  it('should render 6 table header cells by default', () => {
    setUp();
    expect(screen.getAllByRole('columnheader')).toHaveLength(6);
  });

  it('should render table header cells without "order by" icon by default', () => {
    setUp();
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
  });

  it('should render table header cells with conditional order by icon', () => {
    setUp();

    const getThElementForSortableField = (orderableField: string) => screen.getAllByRole('columnheader').find(
      ({ innerHTML }) => innerHTML.includes(SHORT_URLS_ORDERABLE_FIELDS[orderableField as ShortUrlsOrderableFields]),
    );
    const sortableFields = Object.keys(SHORT_URLS_ORDERABLE_FIELDS).filter((sortableField) => sortableField !== 'title');

    expect.assertions(sortableFields.length * 2);
    sortableFields.forEach((sortableField) => {
      const element = getThElementForSortableField(sortableField);

      expect(element).toBeDefined();
      element && fireEvent.click(element);
      expect(orderByColumn).toHaveBeenCalled();
    });
  });

  it('should render composed title column', () => {
    setUp(fromPartial({ version: '2.0.0' }));

    const { innerHTML } = screen.getAllByRole('columnheader')[2];

    expect(innerHTML).toContain('Title');
    expect(innerHTML).toContain('Long URL');
  });
});
