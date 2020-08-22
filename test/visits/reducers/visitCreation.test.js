import { CREATE_VISIT, createNewVisit } from '../../../src/visits/reducers/visitCreation';

describe('visitCreationReducer', () => {
  describe('createNewVisit', () => {
    it('just returns the action with proper type', () =>
      expect(createNewVisit({ shortUrl: {}, visit: {} })).toEqual(
        { type: CREATE_VISIT, shortUrl: {}, visit: {} },
      ));
  });
});
