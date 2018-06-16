import React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import Tag from '../utils/Tag';
import { listShortUrls } from './reducers/shortUrlsList';
import { isEmpty } from 'ramda';

export class ShortUrlsList extends React.Component {
  componentDidMount() {
    const { match } = this.props;
    this.props.listShortUrls(match.params.serverId, { page: match.params.page });
  }

  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Created at</th>
            <th>Short URL</th>
            <th>Original URL</th>
            <th>Tags</th>
            <th>Visits</th>
            <th> - </th>
          </tr>
        </thead>
        <tbody>
          {this.renderShortUrls()}
        </tbody>
      </table>
    );
  }

  renderShortUrls() {
    const { shortUrlsList, selectedServer } = this.props;
    if (isEmpty(shortUrlsList)) {
      return <li><i>Loading...</i></li>;
    }

    return shortUrlsList.map(shortUrl => (
      <tr key={shortUrl.shortCode}>
        <td className="nowrap"><Moment format="YYYY-MM-DD HH:mm" interval={0}>{shortUrl.dateCreated}</Moment></td>
        <td>
          <a href={`${selectedServer.url}/${shortUrl.shortCode}`} target="_blank">
            {`${selectedServer.url}/${shortUrl.shortCode}`}
          </a>
        </td>
        <td>
          <a href={shortUrl.originalUrl} target="_blank">{shortUrl.originalUrl}</a>
        </td>
        <td>{ShortUrlsList.renderTags(shortUrl.tags)}</td>
        <td>{shortUrl.visitsCount}</td>
        <td></td>
      </tr>
    ));
  }

  static renderTags(tags) {
    if (isEmpty(tags)) {
      return <i className="nowrap"><small>No tags</small></i>;
    }

    return tags.map(tag => <Tag text={tag} />);
  }
}

export default connect(state => ({
  shortUrlsList: state.shortUrlsList,
  selectedServer: state.selectedServer,
}), { listShortUrls })(ShortUrlsList);
