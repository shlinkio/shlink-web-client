import { fromPartial } from '@total-typescript/shoehorn';
import type { RegularServer } from '../../../src/servers/data';
import { ServersImporter } from '../../../src/servers/services/ServersImporter';

describe('ServersImporter', () => {
  const servers: RegularServer[] = [fromPartial<RegularServer>({}), fromPartial<RegularServer>({})];
  const csvjsonMock = vi.fn().mockResolvedValue(servers);
  const text = vi.fn().mockReturnValue('');
  const fileMock = () => fromPartial<File>({ text });
  const importer = new ServersImporter(csvjsonMock);

  describe('importServersFromFile', () => {
    it.each([[null], [undefined]])('rejects with error if no file was provided', async (file) => {
      await expect(importer.importServersFromFile(file)).rejects.toEqual(
        new Error('No file provided'),
      );
    });

    it('rejects with error if parsing the file fails', async () => {
      const expectedError = new Error('Error parsing file');

      csvjsonMock.mockRejectedValue(expectedError);

      await expect(importer.importServersFromFile(fileMock())).rejects.toEqual(expectedError);
    });

    it.each([
      [{}],
      [undefined],
      [[{ foo: 'bar' }]],
      [
        [
          {
            url: 1,
            apiKey: 1,
            name: 1,
          },
        ],
      ],
      [
        [
          {
            url: 'foo',
            apiKey: 'foo',
            name: 'foo',
          },
          { bar: 'foo' },
        ],
      ],
    ])('rejects with error if provided file does not parse to valid list of servers', async (parsedObject) => {
      csvjsonMock.mockResolvedValue(parsedObject);

      await expect(importer.importServersFromFile(fileMock())).rejects.toEqual(
        new Error('Provided file does not have the right format.'),
      );
    });

    it('reads file when a CSV containing valid servers is provided', async () => {
      const expectedServers = [
        {
          url: 'foo',
          apiKey: 'foo',
          name: 'foo',
        },
        {
          url: 'bar',
          apiKey: 'bar',
          name: 'bar',
        },
      ];

      csvjsonMock.mockResolvedValue(expectedServers);

      const result = await importer.importServersFromFile(fileMock());

      expect(result).toEqual(expectedServers);
      expect(text).toHaveBeenCalledTimes(1);
      expect(csvjsonMock).toHaveBeenCalledTimes(1);
    });
  });
});
