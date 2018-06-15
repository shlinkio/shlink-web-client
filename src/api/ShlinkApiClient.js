import axios from 'axios';
import { isEmpty } from 'ramda';

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
   * @param params
   * @returns {Promise<Array>}
   */
  listShortUrls = (params = {}) => {
    const { page = 1 } = params;
    return this._performRequest(`/rest/short-codes?page=${page}`)
      .then(resp => resp.data.shortUrls.data)
      .catch(e => {
        // If auth failed, reset token to force it to be regenerated, and perform a new request
        if (e.response.status === 401) {
          this._token = '';
          return this.listShortUrls(params);
        }

        // Otherwise, let caller handle the rejection
        return Promise.reject(e);
      });
  };

  _performRequest = async (url, method = 'GET') => {
    if (isEmpty(this._token)) {
      this._token = await this._handleAuth();
    }

    return await this.axios({
      method,
      url: `${this._baseUrl}${url}`,
      headers: { 'Authorization': `Bearer ${this._token}` }
    }).then(resp => {
      // Save new token
      const { authorization = '' } = resp.headers;
      this._token = authorization.substr('Bearer '.length);
      return resp;
    });
  };

  _handleAuth = async () => {
    const resp = await this.axios({
      method: 'POST',
      url: `${this._baseUrl}/rest/authenticate`,
      data: { apiKey: this._apiKey }
    });
    return resp.data.token;
  };
}

export default new ShlinkApiClient(axios);
