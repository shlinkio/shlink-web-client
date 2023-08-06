import { fromPartial } from '@total-typescript/shoehorn';
import type { ShlinkShortUrl } from '../../../src/short-urls/data';
import { createNewVisits } from '../../../src/visits/reducers/visitCreation';
import type { Visit } from '../../../src/visits/types';

describe('visitCreationReducer', () => {
  describe('createNewVisits', () => {
    const shortUrl = fromPartial<ShlinkShortUrl>({});
    const visit = fromPartial<Visit>({});

    it('just returns the action with proper type', () => {
      const { payload } = createNewVisits([{ shortUrl, visit }]);
      expect(payload).toEqual({ createdVisits: [{ shortUrl, visit }] });
    });
  });
});
