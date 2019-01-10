import qs from 'qs';
import { isEmpty, isNil, reject } from 'ramda';

const API_VERSION = '1';
const buildRestUrl = (url) => url ? `${url}/rest/v${API_VERSION}` : '';

export default class ShlinkApiClient {
  constructor(axios, baseUrl, apiKey) {
    this.axios = axios;
    this._baseUrl = buildRestUrl(baseUrl);
    this._apiKey = apiKey || '';
  }

  listShortUrls = (options = {}) =>
    this._performRequest('/short-urls', 'GET', options)
      .then((resp) => resp.data.shortUrls);

  createShortUrl = (options) => {
    const filteredOptions = reject((value) => isEmpty(value) || isNil(value), options);

    return this._performRequest('/short-urls', 'POST', {}, filteredOptions)
      .then((resp) => resp.data);
  };

  getShortUrlVisits = (shortCode, dates) =>
    this._performRequest(`/short-urls/${shortCode}/visits`, 'GET', dates)
      .then((resp) => resp.data.visits.data);

  getShortUrl = (shortCode) =>
    this._performRequest(`/short-urls/${shortCode}`, 'GET')
      .then((resp) => resp.data);

  deleteShortUrl = (shortCode) =>
    this._performRequest(`/short-urls/${shortCode}`, 'DELETE')
      .then(() => ({}));

  updateShortUrlTags = (shortCode, tags) =>
    this._performRequest(`/short-urls/${shortCode}/tags`, 'PUT', {}, { tags })
      .then((resp) => resp.data.tags);

  listTags = () =>
    this._performRequest('/tags', 'GET')
      .then((resp) => resp.data.tags.data);

  deleteTags = (tags) =>
    this._performRequest('/tags', 'DELETE', { tags })
      .then(() => ({ tags }));

  editTag = (oldName, newName) =>
    this._performRequest('/tags', 'PUT', {}, { oldName, newName })
      .then(() => ({ oldName, newName }));

  _performRequest = async (url, method = 'GET', query = {}, body = {}) =>
    await this.axios({
      method,
      url: `${this._baseUrl}${url}`,
      headers: { 'X-Api-Key': this._apiKey },
      params: query,
      data: body,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
    });
}
