import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectServer } from '../servers/reducers/selectedServer';
import CreateShortUrl from '../short-urls/CreateShortUrl';
import ShortUrls from '../short-urls/ShortUrls';
import ShortUrlsVisits from '../short-urls/ShortUrlVisits';
import AsideMenu from './AsideMenu';
import { pick } from 'ramda';
import Swipeable from 'react-swipeable';
import './MenuLayout.scss';

export class MenuLayout extends React.Component {
  state = { showSideBar: false };

  // FIXME Shouldn't use componentWillMount, but this code has to be run before children components are rendered
  componentWillMount() {
    const { serverId } = this.props.match.params;
    this.props.selectServer(serverId);
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;

    // Hide sidebar when location changes
    if (location !== prevProps.location) {
      this.setState({ showSideBar: false });
    }
  }

  render() {
    const { selectedServer } = this.props;

    return (
      <Swipeable
        delta={40}
        onSwipedLeft={() => this.setState({ showSideBar: false })}
        onSwipedRight={() => this.setState({ showSideBar: true })}
        className="menu-layout__swipeable"
      >
        <div className="row menu-layout__swipeable-inner">
          <AsideMenu
            className="col-lg-2 col-md-3"
            selectedServer={selectedServer}
            showOnMobile={this.state.showSideBar}
          />
          <div
            className="col-lg-10 offset-lg-2 col-md-9 offset-md-3"
            onClick={() => this.setState({ showSideBar: false })}
          >
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
      </Swipeable>
    );
  }
}

export default compose(
  connect(pick(['selectedServer', 'shortUrlsListParams']), { selectServer }),
  withRouter
)(MenuLayout);
