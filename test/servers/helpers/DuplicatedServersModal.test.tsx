import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mock } from 'ts-mockery';
import { DuplicatedServersModal } from '../../../src/servers/helpers/DuplicatedServersModal';
import { ServerData } from '../../../src/servers/data';

describe('<DuplicatedServersModal />', () => {
  const onDiscard = jest.fn();
  const onSave = jest.fn();
  const setUp = (duplicatedServers: ServerData[] = []) => ({
    user: userEvent.setup(),
    ...render(
      <DuplicatedServersModal isOpen duplicatedServers={duplicatedServers} onDiscard={onDiscard} onSave={onSave} />,
    ),
  });

  beforeEach(jest.clearAllMocks);

  it.each([
    [[], 0],
    [[Mock.all<ServerData>()], 2],
    [[Mock.all<ServerData>(), Mock.all<ServerData>()], 2],
    [[Mock.all<ServerData>(), Mock.all<ServerData>(), Mock.all<ServerData>()], 3],
    [[Mock.all<ServerData>(), Mock.all<ServerData>(), Mock.all<ServerData>(), Mock.all<ServerData>()], 4],
  ])('renders expected amount of items', (duplicatedServers, expectedItems) => {
    setUp(duplicatedServers);
    expect(screen.queryAllByRole('listitem')).toHaveLength(expectedItems);
  });

  it.each([
    [
      [Mock.all<ServerData>()],
      {
        header: 'Duplicated server',
        firstParagraph: 'There is already a server with:',
        lastParagraph: 'Do you want to save this server anyway?',
        discardBtn: 'Discard',
      },
    ],
    [
      [Mock.all<ServerData>(), Mock.all<ServerData>()],
      {
        header: 'Duplicated servers',
        firstParagraph: 'The next servers already exist:',
        lastParagraph: 'Do you want to ignore duplicated servers?',
        discardBtn: 'Ignore duplicated',
      },
    ],
  ])('renders expected texts based on amount of servers', (duplicatedServers, assertions) => {
    setUp(duplicatedServers);

    expect(screen.getByRole('heading')).toHaveTextContent(assertions.header);
    expect(screen.getByText(assertions.firstParagraph)).toBeInTheDocument();
    expect(screen.getByText(assertions.lastParagraph)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: assertions.discardBtn })).toBeInTheDocument();
  });

  it.each([
    [[]],
    [[Mock.of<ServerData>({ url: 'url', apiKey: 'apiKey' })]],
    [[
      Mock.of<ServerData>({ url: 'url_1', apiKey: 'apiKey_1' }),
      Mock.of<ServerData>({ url: 'url_2', apiKey: 'apiKey_2' }),
    ]],
  ])('displays provided server data', (duplicatedServers) => {
    setUp(duplicatedServers);

    if (duplicatedServers.length === 0) {
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    } else if (duplicatedServers.length === 1) {
      const [firstItem, secondItem] = screen.getAllByRole('listitem');

      expect(firstItem).toHaveTextContent(`URL: ${duplicatedServers[0].url}`);
      expect(secondItem).toHaveTextContent(`API key: ${duplicatedServers[0].apiKey}`);
    } else {
      expect.assertions(duplicatedServers.length);
      screen.getAllByRole('listitem').forEach((item, index) => {
        const server = duplicatedServers[index];
        expect(item).toHaveTextContent(`${server.url} - ${server.apiKey}`);
      });
    }
  });

  it('invokes onDiscard when appropriate button is clicked', async () => {
    const { user } = setUp();

    expect(onDiscard).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Discard' }));
    expect(onDiscard).toHaveBeenCalled();
  });

  it('invokes onSave when appropriate button is clicked', async () => {
    const { user } = setUp();

    expect(onSave).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Save anyway' }));
    expect(onSave).toHaveBeenCalled();
  });
});
