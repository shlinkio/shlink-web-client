import { fireEvent, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { ShortUrlsTable as shortUrlsTableCreator } from '../../src/short-urls/ShortUrlsTable';
import { ShortUrlsList } from '../../src/short-urls/reducers/shortUrlsList';
import { ReachableServer, SelectedServer } from '../../src/servers/data';
import { ShortUrlsOrderableFields, SHORT_URLS_ORDERABLE_FIELDS } from '../../src/short-urls/data';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<ShortUrlsTable />', () => {
  const shortUrlsList = Mock.all<ShortUrlsList>();
  const orderByColumn = jest.fn();
  const ShortUrlsTable = shortUrlsTableCreator(() => <span>ShortUrlsRow</span>);
  const setUp = (server: SelectedServer = null) => renderWithEvents(
    <ShortUrlsTable shortUrlsList={shortUrlsList} selectedServer={server} orderByColumn={() => orderByColumn} />,
  );

  afterEach(jest.resetAllMocks);

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
    setUp(Mock.of<ReachableServer>({ version: '2.0.0' }));

    const { innerHTML } = screen.getAllByRole('columnheader')[2];

    expect(innerHTML).toContain('Title');
    expect(innerHTML).toContain('Long URL');
  });
});
