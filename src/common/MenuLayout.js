import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectServer } from '../servers/reducers/selectedServer';
import CreateShortUrl from '../short-urls/CreateShortUrl';
import ShortUrls from '../short-urls/ShortUrls';
import ShortUrlsVisits from '../short-urls/ShortUrlVisits';
import AsideMenu from './AsideMenu';
import { pick } from 'ramda';

export class MenuLayout extends React.Component {
  // FIXME Shouldn't use componentWillMount, but this code has to be run before children components are rendered
  componentWillMount() {
    const { serverId } = this.props.match.params;
    this.props.selectServer(serverId);
  }

  render() {
    return (
      <div className="row">
        <AsideMenu {...this.props} />
        <div className="col-md-10 offset-md-2 col-sm-9 offset-sm-3">
          <Switch>
            <Route
              exact
              path="/server/:serverId/list-short-urls/:page"
              component={ShortUrls}
            />
            <Route
              exact
              path="/server/:serverId/create-short-url"
              component={CreateShortUrl}
            />
            <Route
              exact
              path="/server/:serverId/short-code/:shortCode/visits"
              component={ShortUrlsVisits}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default connect(pick(['selectedServer', 'shortUrlsListParams']), { selectServer })(MenuLayout);
