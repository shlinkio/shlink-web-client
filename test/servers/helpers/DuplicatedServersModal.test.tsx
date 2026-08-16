import { fromPartial } from '@total-typescript/shoehorn';
import { page } from 'vitest/browser';
import type { ServerData } from '../../../src/servers/data';
import { DuplicatedServersModal } from '../../../src/servers/helpers/DuplicatedServersModal';
import { checkAccessibility } from '../../__helpers__/accessibility';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<DuplicatedServersModal />', () => {
  const onClose = vi.fn();
  const onConfirm = vi.fn();
  const setUp = (duplicatedServers: ServerData[] = []) =>
    renderWithEvents(
      <DuplicatedServersModal open duplicatedServers={duplicatedServers} onClose={onClose} onConfirm={onConfirm} />,
    );
  const mockServer = (data: Partial<ServerData> = {}) => fromPartial<ServerData>(data);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it.each([
    [[], 0],
    [[mockServer()], 2],
    [[mockServer(), mockServer()], 2],
    [[mockServer(), mockServer(), mockServer()], 3],
    [[mockServer(), mockServer(), mockServer(), mockServer()], 4],
  ])('renders expected amount of items', (duplicatedServers, expectedItems) => {
    setUp(duplicatedServers);
    expect(page.getByRole('listitem')).toHaveLength(expectedItems);
  });

  it.each([
    [
      [mockServer()],
      {
        header: 'Duplicated server',
        firstParagraph: 'There is already a server with:',
        lastParagraph: 'Do you want to save this server?',
        discardBtn: 'Discard',
        confirmButton: 'Save duplicate',
      },
    ],
    [
      [mockServer(), mockServer()],
      {
        header: 'Duplicated servers',
        firstParagraph: 'The next servers already exist:',
        lastParagraph: 'Do you want to save duplicated servers?',
        discardBtn: 'Ignore duplicates',
        confirmButton: 'Save duplicates',
      },
    ],
  ])('renders expected texts based on amount of servers', async (duplicatedServers, assertions) => {
    setUp(duplicatedServers);

    await expect.element(page.getByRole('heading')).toHaveTextContent(assertions.header);
    await expect.element(page.getByText(assertions.firstParagraph)).toBeInTheDocument();
    await expect.element(page.getByText(assertions.lastParagraph)).toBeInTheDocument();
    await expect.element(page.getByRole('button', { name: assertions.discardBtn })).toBeInTheDocument();
    await expect.element(page.getByRole('button', { name: assertions.confirmButton })).toBeInTheDocument();
  });

  it.each([
    [[]],
    [[mockServer({ url: 'url', apiKey: 'apiKey' })]],
    [[mockServer({ url: 'url_1', apiKey: 'apiKey_1' }), mockServer({ url: 'url_2', apiKey: 'apiKey_2' })]],
  ])('displays provided server data', async (duplicatedServers) => {
    setUp(duplicatedServers);

    if (duplicatedServers.length === 0) {
      await expect.element(page.getByRole('listitem')).not.toBeInTheDocument();
    } else if (duplicatedServers.length === 1) {
      const [firstItem, secondItem] = page.getByRole('listitem').elements();

      await expect.element(firstItem).toHaveTextContent(`URL: ${duplicatedServers[0].url}`);
      await expect.element(secondItem).toHaveTextContent(`API key: ${duplicatedServers[0].apiKey}`);
    } else {
      expect.assertions(duplicatedServers.length);
      await Promise.all(
        page
          .getByRole('listitem')
          .elements()
          .map((item, index) => {
            const server = duplicatedServers[index];
            return expect.element(item).toHaveTextContent(`${server.url} - ${server.apiKey}`);
          }),
      );
    }
  });

  it('invokes onClose when appropriate button is clicked', async () => {
    const { user } = setUp();

    expect(onClose).not.toHaveBeenCalled();
    await user.click(page.getByRole('button', { name: 'Discard' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('invokes onConfirm when appropriate button is clicked', async () => {
    const { user } = setUp();

    expect(onConfirm).not.toHaveBeenCalled();
    await user.click(page.getByRole('button', { name: 'Save duplicate' }));
    expect(onConfirm).toHaveBeenCalled();
  });
});
