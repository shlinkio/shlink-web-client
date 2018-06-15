import React from 'react';
import { connect } from 'react-redux';
import { listShortUrls } from './reducers/shortUrlsList';

export class ShortUrlsList extends React.Component {
  componentDidMount() {
    const { match } = this.props;
    this.props.listShortUrls(match.params.serverId);
  }

  render() {
    return (
      <ul>
        {this.renderShortUrls()}
      </ul>
    );
  }

  renderShortUrls() {
    const { shortUrlsList } = this.props;
    if (! shortUrlsList) {
      return '<li><i>Loading...</i></li>';
    }

    return shortUrlsList.map(shortUrl => (
      <li key={shortUrl.shortCode}>{`${shortUrl.shortCode}`}</li>
    ));
  }
}

export default connect(state => ({
  shortUrlsList: state.shortUrlsList
}), { listShortUrls })(ShortUrlsList);
