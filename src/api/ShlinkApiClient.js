import axios from 'axios';
import { isEmpty } from 'ramda';
import qs from 'qs';

export class ShlinkApiClient {
  constructor(axios) {
    this.axios = axios;
    this._baseUrl = '';
    this._apiKey = '';
    this._token = '';
  }

  /**
   * Sets the base URL to be used on any request
   * @param {String} baseUrl
   * @param {String} apiKey
   */
  setConfig = ({ url, apiKey }) => {
    this._baseUrl = url;
    this._apiKey = apiKey;
  };

  /**
   * Returns the list of short URLs
   * @param options
   * @returns {Promise<Array>}
   */
  listShortUrls = (options = {}) => {
    return this._performRequest('/rest/short-codes', 'GET', options)
      .then(resp => resp.data.shortUrls)
      .catch(e => this._handleAuthError(e, this.listShortUrls, [options]));
  };

  _performRequest = async (url, method = 'GET', params = {}, data = {}) => {
    if (isEmpty(this._token)) {
      this._token = await this._authenticate();
    }

    return await this.axios({
      method,
      url: `${this._baseUrl}${url}`,
      headers: { 'Authorization': `Bearer ${this._token}` },
      params,
      data,
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' })
    }).then(resp => {
      // Save new token
      const { authorization = '' } = resp.headers;
      this._token = authorization.substr('Bearer '.length);
      return resp;
    });
  };

  _authenticate = async () => {
    const resp = await this.axios({
      method: 'POST',
      url: `${this._baseUrl}/rest/authenticate`,
      data: { apiKey: this._apiKey }
    });
    return resp.data.token;
  };

  _handleAuthError = (e, method, args) => {
    // If auth failed, reset token to force it to be regenerated, and perform a new request
    if (e.response.status === 401) {
      this._token = '';
      return method(...args);
    }

    // Otherwise, let caller handle the rejection
    return Promise.reject(e);
  };
}

export default new ShlinkApiClient(axios);
