import sinon from 'sinon';
import { head, last } from 'ramda';
import ShlinkApiClient from '../../../src/utils/services/ShlinkApiClient';

describe('ShlinkApiClient', () => {
  const createAxiosMock = (data) => () => Promise.resolve(data);
  const createApiClient = (data) => new ShlinkApiClient(createAxiosMock(data));

  describe('listShortUrls', () => {
    it('properly returns short URLs list', async () => {
      const expectedList = [ 'foo', 'bar' ];

      const { listShortUrls } = createApiClient({
        data: {
          shortUrls: expectedList,
        },
      });

      const actualList = await listShortUrls();

      expect(expectedList).toEqual(actualList);
    });
  });

  describe('createShortUrl', () => {
    const shortUrl = {
      bar: 'foo',
    };

    it('returns create short URL', async () => {
      const { createShortUrl } = createApiClient({ data: shortUrl });
      const result = await createShortUrl({});

      expect(result).toEqual(shortUrl);
    });

    it('removes all empty options', async () => {
      const axiosSpy = sinon.spy(createAxiosMock({ data: shortUrl }));
      const { createShortUrl } = new ShlinkApiClient(axiosSpy);

      await createShortUrl(
        { foo: 'bar', empty: undefined, anotherEmpty: null }
      );
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect(axiosArgs.data).toEqual({ foo: 'bar' });
    });
  });

  describe('getShortUrlVisits', () => {
    it('properly returns short URL visits', async () => {
      const expectedVisits = [ 'foo', 'bar' ];
      const axiosSpy = sinon.spy(createAxiosMock({
        data: {
          visits: {
            data: expectedVisits,
          },
        },
      }));
      const { getShortUrlVisits } = new ShlinkApiClient(axiosSpy);

      const actualVisits = await getShortUrlVisits('abc123', {});
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect({ data: expectedVisits }).toEqual(actualVisits);
      expect(axiosArgs.url).toContain('/short-urls/abc123/visits');
      expect(axiosArgs.method).toEqual('GET');
    });
  });

  describe('getShortUrl', () => {
    it('properly returns short URL', async () => {
      const expectedShortUrl = { foo: 'bar' };
      const axiosSpy = sinon.spy(createAxiosMock({
        data: expectedShortUrl,
      }));
      const { getShortUrl } = new ShlinkApiClient(axiosSpy);

      const result = await getShortUrl('abc123');
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect(expectedShortUrl).toEqual(result);
      expect(axiosArgs.url).toContain('/short-urls/abc123');
      expect(axiosArgs.method).toEqual('GET');
    });
  });

  describe('updateShortUrlTags', () => {
    it('properly updates short URL tags', async () => {
      const expectedTags = [ 'foo', 'bar' ];
      const axiosSpy = sinon.spy(createAxiosMock({
        data: { tags: expectedTags },
      }));
      const { updateShortUrlTags } = new ShlinkApiClient(axiosSpy);

      const result = await updateShortUrlTags('abc123', expectedTags);
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect(expectedTags).toEqual(result);
      expect(axiosArgs.url).toContain('/short-urls/abc123/tags');
      expect(axiosArgs.method).toEqual('PUT');
    });
  });

  describe('listTags', () => {
    it('properly returns list of tags', async () => {
      const expectedTags = [ 'foo', 'bar' ];
      const axiosSpy = sinon.spy(createAxiosMock({
        data: {
          tags: { data: expectedTags },
        },
      }));
      const { listTags } = new ShlinkApiClient(axiosSpy);

      const result = await listTags();
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect(expectedTags).toEqual(result);
      expect(axiosArgs.url).toContain('/tags');
      expect(axiosArgs.method).toEqual('GET');
    });
  });

  describe('deleteTags', () => {
    it('properly deletes provided tags', async () => {
      const tags = [ 'foo', 'bar' ];
      const axiosSpy = sinon.spy(createAxiosMock({}));
      const { deleteTags } = new ShlinkApiClient(axiosSpy);

      await deleteTags(tags);
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect(axiosArgs.url).toContain('/tags');
      expect(axiosArgs.method).toEqual('DELETE');
      expect(axiosArgs.params).toEqual({ tags });
    });
  });

  describe('editTag', () => {
    it('properly edits provided tag', async () => {
      const oldName = 'foo';
      const newName = 'bar';
      const axiosSpy = sinon.spy(createAxiosMock({}));
      const { editTag } = new ShlinkApiClient(axiosSpy);

      await editTag(oldName, newName);
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect(axiosArgs.url).toContain('/tags');
      expect(axiosArgs.method).toEqual('PUT');
      expect(axiosArgs.data).toEqual({ oldName, newName });
    });
  });

  describe('deleteShortUrl', () => {
    it('properly deletes provided short URL', async () => {
      const axiosSpy = sinon.spy(createAxiosMock({}));
      const { deleteShortUrl } = new ShlinkApiClient(axiosSpy);

      await deleteShortUrl('abc123');
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect(axiosArgs.url).toContain('/short-urls/abc123');
      expect(axiosArgs.method).toEqual('DELETE');
    });
  });
});
