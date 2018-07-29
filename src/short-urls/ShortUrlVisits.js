import React from 'react';
import { connect } from 'react-redux';

export class ShortUrlsVisits extends React.Component {
  render() {
    const { match: { params } } = this.props;
    return <div>Visits for <b>{params.shortCode}</b></div>;
  }
}

export default connect()(ShortUrlsVisits);
