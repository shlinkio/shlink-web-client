import React from 'react';
import { connect } from 'react-redux';
import { pick } from 'ramda';
import { getShortUrlVisits } from './reducers/shortUrlVisits';

export class ShortUrlsVisits extends React.Component {
  componentDidMount() {
    const { match: { params } } = this.props;
    this.props.getShortUrlVisits(params.shortCode);
  }

  render() {
    const { match: { params }, selectedServer } = this.props;
    const serverUrl = selectedServer ? selectedServer.url : '';
    const shortUrl = `${serverUrl}/${params.shortCode}`;

    return (
      <div className="short-urls-container">
        <div className="card bg-light">
          <div className="card-body">
            <h2>Visit stats for <a target="_blank" href={shortUrl}>{shortUrl}</a></h2>
            {/* TODO Once Shlink's API allows it, add total visits counter, long URL and creation time */}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(pick(['selectedServer']), {
  getShortUrlVisits
})(ShortUrlsVisits);
