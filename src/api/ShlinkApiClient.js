import axios from 'axios';
import qs from 'qs';
import { isEmpty, isNil, reject } from 'ramda';

const API_VERSION = '1';
const STATUS_UNAUTHORIZED = 401;

export class ShlinkApiClient {
  constructor(axios) {
    this.axios = axios;
    this._baseUrl = '';
    this._apiKey = '';
    this._token = '';
  }

  /**
   * Sets the base URL to be used on any request
   */
  setConfig = ({ url, apiKey }) => {
    this._baseUrl = `${url}/rest/v${API_VERSION}`;
    this._apiKey = apiKey;
  };

  listShortUrls = (options = {}) =>
    this._performRequest('/short-codes', 'GET', options)
      .then((resp) => resp.data.shortUrls)
      .catch((e) => this._handleAuthError(e, this.listShortUrls, [ options ]));

  createShortUrl = (options) => {
    const filteredOptions = reject((value) => isEmpty(value) || isNil(value), options);

    return this._performRequest('/short-codes', 'POST', {}, filteredOptions)
      .then((resp) => resp.data)
      .catch((e) => this._handleAuthError(e, this.createShortUrl, [ filteredOptions ]));
  };

  getShortUrlVisits = (shortCode, dates) =>
    this._performRequest(`/short-codes/${shortCode}/visits`, 'GET', dates)
      .then((resp) => resp.data.visits.data)
      .catch((e) => this._handleAuthError(e, this.getShortUrlVisits, [ shortCode, dates ]));

  getShortUrl = (shortCode) =>
    this._performRequest(`/short-codes/${shortCode}`, 'GET')
      .then((resp) => resp.data)
      .catch((e) => this._handleAuthError(e, this.getShortUrl, [ shortCode ]));

  deleteShortUrl = (shortCode) =>
    this._performRequest(`/short-codes/${shortCode}`, 'DELETE')
      .then(() => ({}))
      .catch((e) => this._handleAuthError(e, this.deleteShortUrl, [ shortCode ]));

  updateShortUrlTags = (shortCode, tags) =>
    this._performRequest(`/short-codes/${shortCode}/tags`, 'PUT', {}, { tags })
      .then((resp) => resp.data.tags)
      .catch((e) => this._handleAuthError(e, this.updateShortUrlTags, [ shortCode, tags ]));

  listTags = () =>
    this._performRequest('/tags', 'GET')
      .then((resp) => resp.data.tags.data)
      .catch((e) => this._handleAuthError(e, this.listTags, []));

  deleteTags = (tags) =>
    this._performRequest('/tags', 'DELETE', { tags })
      .then(() => ({ tags }))
      .catch((e) => this._handleAuthError(e, this.deleteTags, [ tags ]));

  editTag = (oldName, newName) =>
    this._performRequest('/tags', 'PUT', {}, { oldName, newName })
      .then(() => ({ oldName, newName }))
      .catch((e) => this._handleAuthError(e, this.editTag, [ oldName, newName ]));

  _performRequest = async (url, method = 'GET', query = {}, body = {}) => {
    if (isEmpty(this._token)) {
      this._token = await this._authenticate();
    }

    return await this.axios({
      method,
      url: `${this._baseUrl}${url}`,
      headers: { Authorization: `Bearer ${this._token}` },
      params: query,
      data: body,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
    }).then((resp) => {
      // Save new token
      const { authorization = '' } = resp.headers;

      this._token = authorization.substr('Bearer '.length);

      return resp;
    });
  };

  _authenticate = async () => {
    const resp = await this.axios({
      method: 'POST',
      url: `${this._baseUrl}/authenticate`,
      data: { apiKey: this._apiKey },
    });

    return resp.data.token;
  };

  _handleAuthError = (e, method, args) => {
    // If auth failed, reset token to force it to be regenerated, and perform a new request
    if (e.response.status === STATUS_UNAUTHORIZED) {
      this._token = '';

      return method(...args);
    }

    // Otherwise, let caller handle the rejection
    return Promise.reject(e);
  };
}

const shlinkApiClient = new ShlinkApiClient(axios);

export default shlinkApiClient;
