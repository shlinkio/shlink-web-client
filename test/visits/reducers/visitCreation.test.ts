import { Mock } from 'ts-mockery';
import { CREATE_VISIT, createNewVisit } from '../../../src/visits/reducers/visitCreation';
import { ShortUrl } from '../../../src/short-urls/data';
import { Visit } from '../../../src/visits/types';

describe('visitCreationReducer', () => {
  describe('createNewVisit', () => {
    const shortUrl = Mock.all<ShortUrl>();
    const visit = Mock.all<Visit>();

    it('just returns the action with proper type', () =>
      expect(createNewVisit({ shortUrl, visit })).toEqual(
        { type: CREATE_VISIT, shortUrl, visit },
      ));
  });
});
