import reducer, {
  EDIT_SHORT_URL_TAGS,
  EDIT_SHORT_URL_TAGS_ERROR,
  EDIT_SHORT_URL_TAGS_START, editShortUrlTags,
  RESET_EDIT_SHORT_URL_TAGS,
  resetShortUrlsTags,
  SHORT_URL_TAGS_EDITED,
  shortUrlTagsEdited,
} from '../../../src/short-urls/reducers/shortUrlTags';

describe('shortUrlTagsReducer', () => {
  const tags = [ 'foo', 'bar', 'baz' ];
  const shortCode = 'abc123';

  describe('reducer', () => {
    it('returns loading on EDIT_SHORT_URL_TAGS_START', () => {
      expect(reducer({}, { type: EDIT_SHORT_URL_TAGS_START })).toEqual({
        saving: true,
        error: false,
      });
    });

    it('returns error on EDIT_SHORT_URL_TAGS_ERROR', () => {
      expect(reducer({}, { type: EDIT_SHORT_URL_TAGS_ERROR })).toEqual({
        saving: false,
        error: true,
      });
    });

    it('returns provided tags and shortCode on EDIT_SHORT_URL_TAGS', () => {
      expect(reducer({}, { type: EDIT_SHORT_URL_TAGS, tags, shortCode })).toEqual({
        tags,
        shortCode,
        saving: false,
        error: false,
      });
    });

    it('goes back to initial state on RESET_EDIT_SHORT_URL_TAGS', () => {
      expect(reducer({}, { type: RESET_EDIT_SHORT_URL_TAGS })).toEqual({
        tags: [],
        shortCode: null,
        saving: false,
        error: false,
      });
    });
  });

  describe('resetShortUrlsTags', () =>
    it('creates expected action', () => expect(resetShortUrlsTags()).toEqual({ type: RESET_EDIT_SHORT_URL_TAGS })));

  describe('shortUrlTagsEdited', () =>
    it('creates expected action', () => expect(shortUrlTagsEdited(shortCode, tags)).toEqual({
      tags,
      shortCode,
      type: SHORT_URL_TAGS_EDITED,
    })));

  describe('editShortUrlTags', () => {
    const updateShortUrlTags = jest.fn();
    const buildShlinkApiClient = jest.fn().mockResolvedValue({ updateShortUrlTags });
    const dispatch = jest.fn();

    afterEach(() => {
      updateShortUrlTags.mockReset();
      buildShlinkApiClient.mockClear();
      dispatch.mockReset();
    });

    it('dispatches normalized tags on success', async () => {
      const normalizedTags = [ 'bar', 'foo' ];

      updateShortUrlTags.mockResolvedValue(normalizedTags);

      await editShortUrlTags(buildShlinkApiClient)(shortCode, tags)(dispatch);

      expect(buildShlinkApiClient).toHaveBeenCalledTimes(1);
      expect(updateShortUrlTags).toHaveBeenCalledTimes(1);
      expect(updateShortUrlTags).toHaveBeenCalledWith(shortCode, tags);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: EDIT_SHORT_URL_TAGS_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: EDIT_SHORT_URL_TAGS, tags: normalizedTags, shortCode });
    });

    it('dispatches error on failure', async () => {
      const error = new Error();

      updateShortUrlTags.mockRejectedValue(error);

      try {
        await editShortUrlTags(buildShlinkApiClient)(shortCode, tags)(dispatch);
      } catch (e) {
        expect(e).toBe(error);
      }

      expect(buildShlinkApiClient).toHaveBeenCalledTimes(1);
      expect(updateShortUrlTags).toHaveBeenCalledTimes(1);
      expect(updateShortUrlTags).toHaveBeenCalledWith(shortCode, tags);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: EDIT_SHORT_URL_TAGS_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: EDIT_SHORT_URL_TAGS_ERROR });
    });
  });
});
