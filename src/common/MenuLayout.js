import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectServer } from '../servers/reducers/selectedServer';
import CreateShortUrl from '../short-urls/CreateShortUrl';
import ShortUrls from '../short-urls/ShortUrls';
import AsideMenu from './AsideMenu';

export class MenuLayout extends React.Component {
  componentDidMount() {
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
          </Switch>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  selectedServer: state.selectedServer,
  shortUrlsListParams: state.shortUrlsListParams,
}), { selectServer })(MenuLayout);
