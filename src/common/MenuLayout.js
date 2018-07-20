import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import CreateShortUrl from '../short-urls/CreateShortUrl';
import ShortUrls from '../short-urls/ShortUrls';
import AsideMenu from './AsideMenu';

export function MenuLayout(props) {
  return (
    <div className="row">
      <AsideMenu {...props} />
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

export default connect(state => ({
  selectedServer: state.selectedServer,
  shortUrlsListParams: state.shortUrlsListParams,
}))(MenuLayout);
