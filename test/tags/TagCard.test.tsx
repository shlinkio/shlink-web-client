import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import { TagCard as createTagCard } from '../../src/tags/TagCard';
import { ReachableServer } from '../../src/servers/data';
import { renderWithEvents } from '../__helpers__/setUpTest';
import { colorGeneratorMock } from '../utils/services/__mocks__/ColorGenerator.mock';

describe('<TagCard />', () => {
  const TagCard = createTagCard(
    ({ isOpen }) => <span>DeleteTagConfirmModal {isOpen ? '[Open]' : '[Closed]'}</span>,
    ({ isOpen }) => <span>EditTagModal {isOpen ? '[Open]' : '[Closed]'}</span>,
    colorGeneratorMock,
  );
  const setUp = (tag = 'ssr') => renderWithEvents(
    <MemoryRouter>
      <TagCard
        tag={{ tag, visits: 23257, shortUrls: 48 }}
        selectedServer={Mock.of<ReachableServer>({ id: '1' })}
        displayed
        toggle={() => {}}
      />
    </MemoryRouter>,
  );

  afterEach(jest.resetAllMocks);

  it.each([
    ['ssr', '/server/1/list-short-urls/1?tags=ssr', '/server/1/tag/ssr/visits'],
    ['ssr-&-foo', '/server/1/list-short-urls/1?tags=ssr-%26-foo', '/server/1/tag/ssr-&-foo/visits'],
  ])('shows expected links for provided tags', (tag, shortUrlsLink, visitsLink) => {
    setUp(tag);

    expect(screen.getByText('48').parentNode).toHaveAttribute('href', shortUrlsLink);
    expect(screen.getByText('23,257').parentNode).toHaveAttribute('href', visitsLink);
  });

  it('displays delete modal when delete btn is clicked', async () => {
    const { user } = setUp();

    expect(screen.getByText(/^DeleteTagConfirmModal/)).not.toHaveTextContent('[Open]');
    expect(screen.getByText(/^DeleteTagConfirmModal/)).toHaveTextContent('[Closed]');
    await user.click(screen.getByLabelText('Delete tag'));
    expect(screen.getByText(/^DeleteTagConfirmModal/)).toHaveTextContent('[Open]');
    expect(screen.getByText(/^DeleteTagConfirmModal/)).not.toHaveTextContent('[Closed]');
  });

  it('displays edit modal when edit btn is clicked', async () => {
    const { user } = setUp();

    expect(screen.getByText(/^EditTagModal/)).not.toHaveTextContent('[Open]');
    expect(screen.getByText(/^EditTagModal/)).toHaveTextContent('[Closed]');
    await user.click(screen.getByLabelText('Edit tag'));
    expect(screen.getByText(/^EditTagModal/)).toHaveTextContent('[Open]');
    expect(screen.getByText(/^EditTagModal/)).not.toHaveTextContent('[Closed]');
  });
});
