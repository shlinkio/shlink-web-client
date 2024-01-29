import { fireEvent, screen, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { ServersMap, ServerWithId } from '../../../src/servers/data';
import type {
  ImportServersBtnProps } from '../../../src/servers/helpers/ImportServersBtn';
import { ImportServersBtnFactory } from '../../../src/servers/helpers/ImportServersBtn';
import type { ServersImporter } from '../../../src/servers/services/ServersImporter';
import { checkAccessibility } from '../../__helpers__/accessibility';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<ImportServersBtn />', () => {
  const onImportMock = vi.fn();
  const createServersMock = vi.fn();
  const importServersFromFile = vi.fn().mockResolvedValue([]);
  const serversImporterMock = fromPartial<ServersImporter>({ importServersFromFile });
  const ImportServersBtn = ImportServersBtnFactory(fromPartial({ ServersImporter: serversImporterMock }));
  const setUp = (props: Partial<ImportServersBtnProps> = {}, servers: ServersMap = {}) => renderWithEvents(
    <ImportServersBtn
      servers={servers}
      {...props}
      createServers={createServersMock}
      onImport={onImportMock}
    />,
  );

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('shows tooltip on button hover', async () => {
    const { user } = setUp();

    expect(screen.queryByText(/^You can create servers by importing a CSV file/)).not.toBeInTheDocument();
    await user.hover(screen.getByRole('button'));
    await waitFor(
      () => expect(screen.getByText(/^You can create servers by importing a CSV file/)).toBeInTheDocument(),
    );
  });

  it.each([
    [undefined, ''],
    ['foo', 'foo'],
    ['bar', 'bar'],
  ])('allows a class name to be provided', (providedClassName, expectedClassName) => {
    setUp({ className: providedClassName });
    expect(screen.getByRole('button')).toHaveAttribute('class', expect.stringContaining(expectedClassName));
  });

  it.each([
    [undefined, 'Import from file'],
    ['foo', 'foo'],
    ['bar', 'bar'],
  ])('has expected text', (children, expectedText) => {
    setUp({ children });
    expect(screen.getByRole('button')).toHaveTextContent(expectedText);
  });

  it('imports servers when file input changes', async () => {
    const { container } = setUp();
    const input = container.querySelector('[type=file]');

    input && fireEvent.change(input, { target: { files: [''] } });
    expect(importServersFromFile).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(createServersMock).toHaveBeenCalledTimes(1));
  });

  it.each([
    ['Save anyway', true],
    ['Discard', false],
  ])('creates expected servers depending on selected option in modal', async (btnName, savesDuplicatedServers) => {
    const existingServer = fromPartial<ServerWithId>({ id: 'abc', url: 'existingUrl', apiKey: 'existingApiKey' });
    const newServer = fromPartial<ServerWithId>({ url: 'newUrl', apiKey: 'newApiKey' });
    const { container, user } = setUp({}, { abc: existingServer });
    const input = container.querySelector('[type=file]');
    importServersFromFile.mockResolvedValue([existingServer, newServer]);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    input && fireEvent.change(input, { target: { files: [''] } });
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: btnName }));

    expect(createServersMock).toHaveBeenCalledWith(savesDuplicatedServers ? [existingServer, newServer] : [newServer]);
    expect(onImportMock).toHaveBeenCalledTimes(1);
  });
});
