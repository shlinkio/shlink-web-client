import { ShlinkApiClient } from '../../src/api/ShlinkApiClient'
import sinon from 'sinon';
import { head, last } from 'ramda';

describe('ShlinkApiClient', () => {
  const createAxiosMock = extraData => () =>
    Promise.resolve({
     headers: { authorization: 'Bearer abc123' },
      data: { token: 'abc123' },
      ...extraData,
    });
  const createApiClient = extraData =>
    new ShlinkApiClient(createAxiosMock(extraData));

  describe('listShortUrls', () => {
    it('properly returns short URLs list', async () => {
      const expectedList = ['foo', 'bar'];

      const apiClient = createApiClient({
        data: {
          shortUrls: expectedList,
        },
      });

      const actualList = await apiClient.listShortUrls();
      expect(expectedList).toEqual(actualList);
    });
  });

  describe('createShortUrl', () => {
    const shortUrl = {
      bar: 'foo',
    };

    it('returns create short URL', async () => {
      const apiClient = createApiClient({ data: shortUrl });
      const result = await apiClient.createShortUrl({});
      expect(result).toEqual(shortUrl);
    });

    it('removes all empty options', async () => {
      const axiosSpy = sinon.spy(createAxiosMock({ data: shortUrl }));
      const apiClient = new ShlinkApiClient(axiosSpy);

      await apiClient.createShortUrl(
        { foo: 'bar', empty: undefined, anotherEmpty: null }
      );
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect(axiosArgs.data).toEqual({ foo: 'bar' });
    });
  });

  describe('getShortUrlVisits', () => {
    it('properly returns short URL visits', async () => {
      const expectedVisits = ['foo', 'bar'];
      const axiosSpy = sinon.spy(createAxiosMock({
        data: {
          visits: {
            data: expectedVisits,
          },
        },
      }));
      const apiClient = new ShlinkApiClient(axiosSpy);

      const actualVisits = await apiClient.getShortUrlVisits('abc123', {});
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect(expectedVisits).toEqual(actualVisits);
      expect(axiosArgs.url).toContain('/short-codes/abc123/visits');
      expect(axiosArgs.method).toEqual('GET');
    });
  });

  describe('getShortUrl', () => {
    it('properly returns short URL', async () => {
      const expectedShortUrl = { foo: 'bar' };
      const axiosSpy = sinon.spy(createAxiosMock({
        data: expectedShortUrl,
      }));
      const apiClient = new ShlinkApiClient(axiosSpy);

      const result = await apiClient.getShortUrl('abc123');
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect(expectedShortUrl).toEqual(result);
      expect(axiosArgs.url).toContain('/short-codes/abc123');
      expect(axiosArgs.method).toEqual('GET');
    });
  });

  describe('updateShortUrlTags', () => {
    it('properly updates short URL tags', async () => {
      const expectedTags = ['foo', 'bar'];
      const axiosSpy = sinon.spy(createAxiosMock({
        data: { tags: expectedTags },
      }));
      const apiClient = new ShlinkApiClient(axiosSpy);

      const result = await apiClient.updateShortUrlTags('abc123', expectedTags);
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect(expectedTags).toEqual(result);
      expect(axiosArgs.url).toContain('/short-codes/abc123/tags');
      expect(axiosArgs.method).toEqual('PUT');
    });
  });

  describe('listTags', () => {
    it('properly returns list of tags', async () => {
      const expectedTags = ['foo', 'bar'];
      const axiosSpy = sinon.spy(createAxiosMock({
        data: {
          tags: { data: expectedTags }
        },
      }));
      const apiClient = new ShlinkApiClient(axiosSpy);

      const result = await apiClient.listTags();
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect(expectedTags).toEqual(result);
      expect(axiosArgs.url).toContain('/tags');
      expect(axiosArgs.method).toEqual('GET');
    });
  });

  describe('deleteTags', () => {
    it('properly deletes provided tags', async () => {
      const tags = ['foo', 'bar'];
      const axiosSpy = sinon.spy(createAxiosMock({}));
      const apiClient = new ShlinkApiClient(axiosSpy);

      await apiClient.deleteTags(tags);
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect(axiosArgs.url).toContain('/tags');
      expect(axiosArgs.method).toEqual('DELETE');
      expect(axiosArgs.params).toEqual({ tags });
    });
  });

  describe('editTag', () => {
    it('properly deletes provided tags', async () => {
      const oldName = 'foo';
      const newName = 'bar';
      const axiosSpy = sinon.spy(createAxiosMock({}));
      const apiClient = new ShlinkApiClient(axiosSpy);

      await apiClient.editTag(oldName, newName);
      const lastAxiosCall = last(axiosSpy.getCalls());
      const axiosArgs = head(lastAxiosCall.args);

      expect(axiosArgs.url).toContain('/tags');
      expect(axiosArgs.method).toEqual('PUT');
      expect(axiosArgs.data).toEqual({ oldName, newName });
    });
  });
});
