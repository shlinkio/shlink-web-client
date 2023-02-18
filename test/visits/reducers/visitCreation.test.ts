import { Mock } from 'ts-mockery';
import { createNewVisits } from '../../../src/visits/reducers/visitCreation';
import type { ShortUrl } from '../../../src/short-urls/data';
import type { Visit } from '../../../src/visits/types';

describe('visitCreationReducer', () => {
  describe('createNewVisits', () => {
    const shortUrl = Mock.all<ShortUrl>();
    const visit = Mock.all<Visit>();

    it('just returns the action with proper type', () => {
      expect(createNewVisits([{ shortUrl, visit }])).toEqual({
        type: createNewVisits.toString(),
        payload: { createdVisits: [{ shortUrl, visit }] },
      });
    });
  });
});
