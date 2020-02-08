import qs from 'qs';
import { isEmpty, isNil, pipe, reject } from 'ramda';
import PropTypes from 'prop-types';

export const apiErrorType = PropTypes.shape({
  type: PropTypes.string,
  detail: PropTypes.string,
  title: PropTypes.string,
  status: PropTypes.number,
  error: PropTypes.string, // Deprecated
  message: PropTypes.string, // Deprecated
});

const buildShlinkBaseUrl = (url, apiVersion) => url ? `${url}/rest/v${apiVersion}` : '';
const rejectNilProps = (options = {}) => reject(isNil, options);

export default class ShlinkApiClient {
  constructor(axios, baseUrl, apiKey) {
    this.axios = axios;
    this._apiVersion = 2;
    this._baseUrl = baseUrl;
    this._apiKey = apiKey || '';
  }

  listShortUrls = pipe(
    rejectNilProps,
    (options) => this._performRequest('/short-urls', 'GET', options).then((resp) => resp.data.shortUrls)
  );

  createShortUrl = (options) => {
    const filteredOptions = reject((value) => isEmpty(value) || isNil(value), options);

    return this._performRequest('/short-urls', 'POST', {}, filteredOptions)
      .then((resp) => resp.data);
  };

  getShortUrlVisits = (shortCode, query) =>
    this._performRequest(`/short-urls/${shortCode}/visits`, 'GET', query)
      .then((resp) => resp.data.visits);

  getShortUrl = (shortCode, domain) =>
    this._performRequest(`/short-urls/${shortCode}`, 'GET', { domain })
      .then((resp) => resp.data);

  deleteShortUrl = (shortCode, domain) =>
    this._performRequest(`/short-urls/${shortCode}`, 'DELETE', { domain })
      .then(() => ({}));

  updateShortUrlTags = (shortCode, domain, tags) =>
    this._performRequest(`/short-urls/${shortCode}/tags`, 'PUT', { domain }, { tags })
      .then((resp) => resp.data.tags);

  updateShortUrlMeta = (shortCode, domain, meta) =>
    this._performRequest(`/short-urls/${shortCode}`, 'PATCH', { domain }, meta)
      .then(() => meta);

  listTags = () =>
    this._performRequest('/tags', 'GET')
      .then((resp) => resp.data.tags.data);

  deleteTags = (tags) =>
    this._performRequest('/tags', 'DELETE', { tags })
      .then(() => ({ tags }));

  editTag = (oldName, newName) =>
    this._performRequest('/tags', 'PUT', {}, { oldName, newName })
      .then(() => ({ oldName, newName }));

  health = () => this._performRequest('/health', 'GET').then((resp) => resp.data);

  _performRequest = async (url, method = 'GET', query = {}, body = {}) => {
    try {
      return await this.axios({
        method,
        url: `${buildShlinkBaseUrl(this._baseUrl, this._apiVersion)}${url}`,
        headers: { 'X-Api-Key': this._apiKey },
        params: rejectNilProps(query),
        data: body,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
      });
    } catch (e) {
      const { response } = e;

      // Due to a bug on all previous Shlink versions, requests to non-matching URLs will always result on a CORS error
      // when performed from the browser (due to the preflight request not returning a 2xx status.
      // See https://github.com/shlinkio/shlink/issues/614), which will make the "response" prop not to be set here.
      // The bug will be fixed on upcoming Shlink patches, but for other versions, we can consider this situation as
      // if a request has been performed to a not supported API version.
      const apiVersionIsNotSupported = !response;

      // When the request is not invalid or we have already tried both API versions, throw the error and let the
      // caller handle it
      if (!apiVersionIsNotSupported || this._apiVersion === 1) {
        throw e;
      }

      this._apiVersion = 1;

      return await this._performRequest(url, method, query, body);
    }
  }
}
