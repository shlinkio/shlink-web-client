import { fromPartial } from '@total-typescript/shoehorn';
import type { ShortUrl } from '../../../src/shlink-web-component/short-urls/data';
import { createNewVisits } from '../../../src/shlink-web-component/visits/reducers/visitCreation';
import type { Visit } from '../../../src/shlink-web-component/visits/types';

describe('visitCreationReducer', () => {
  describe('createNewVisits', () => {
    const shortUrl = fromPartial<ShortUrl>({});
    const visit = fromPartial<Visit>({});

    it('just returns the action with proper type', () => {
      const { payload } = createNewVisits([{ shortUrl, visit }]);
      expect(payload).toEqual({ createdVisits: [{ shortUrl, visit }] });
    });
  });
});
