import { Mock } from 'ts-mockery';
import { CREATE_VISITS, createNewVisits } from '../../../src/visits/reducers/visitCreation';
import { ShortUrl } from '../../../src/short-urls/data';
import { Visit } from '../../../src/visits/types';

describe('visitCreationReducer', () => {
  describe('createNewVisits', () => {
    const shortUrl = Mock.all<ShortUrl>();
    const visit = Mock.all<Visit>();

    it('just returns the action with proper type', () => {
      expect(createNewVisits([{ shortUrl, visit }])).toEqual(
        { type: CREATE_VISITS, createdVisits: [{ shortUrl, visit }] },
      );
    });
  });
});
