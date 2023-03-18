import { Mock } from 'ts-mockery';
import type { ShortUrl } from '../../../src/short-urls/data';
import { createNewVisits } from '../../../src/visits/reducers/visitCreation';
import type { Visit } from '../../../src/visits/types';

describe('visitCreationReducer', () => {
  describe('createNewVisits', () => {
    const shortUrl = Mock.all<ShortUrl>();
    const visit = Mock.all<Visit>();

    it('just returns the action with proper type', () => {
      const { payload } = createNewVisits([{ shortUrl, visit }]);
      expect(payload).toEqual({ createdVisits: [{ shortUrl, visit }] });
    });
  });
});
