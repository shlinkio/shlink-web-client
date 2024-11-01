import { fromPartial } from '@total-typescript/shoehorn';
import type { ServersMap } from '../../../src/servers/data';
import { ensureUniqueIds } from '../../../src/servers/helpers';

describe('index', () => {
  describe('ensureUniqueIds', () => {
    const servers: ServersMap = {
      'the-name-example.com': fromPartial({}),
      'another-name-example.com': fromPartial({}),
      'short-domain-s.test': fromPartial({}),
    };

    it('returns expected list of servers when existing IDs conflict', () => {
      const result = ensureUniqueIds(servers, [
        fromPartial({ name: 'The name', url: 'https://example.com' }),
        fromPartial({ name: 'Short domain', url: 'https://s.test' }),
        fromPartial({ name: 'The name', url: 'https://example.com' }),
      ]);

      expect(result).toEqual([
        expect.objectContaining({ id: 'the-name-example.com-1' }),
        expect.objectContaining({ id: 'short-domain-s.test-1' }),
        expect.objectContaining({ id: 'the-name-example.com-2' }),
      ]);
    });

    it('returns expected list of servers when IDs conflict in provided list of servers', () => {
      const result = ensureUniqueIds(servers, [
        fromPartial({ name: 'Foo', url: 'https://example.com' }),
        fromPartial({ name: 'Bar', url: 'https://s.test' }),
        fromPartial({ name: 'Foo', url: 'https://example.com' }),
        fromPartial({ name: 'Baz', url: 'https://s.test' }),
      ]);

      expect(result).toEqual([
        expect.objectContaining({ id: 'foo-example.com' }),
        expect.objectContaining({ id: 'bar-s.test' }),
        expect.objectContaining({ id: 'foo-example.com-1' }),
        expect.objectContaining({ id: 'baz-s.test' }),
      ]);
    });
  });
});
