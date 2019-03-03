import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Swipeable from 'react-swipeable';
import { faBars as burgerIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import * as PropTypes from 'prop-types';
import { serverType } from '../servers/prop-types';
import NotFound from './NotFound';
import './MenuLayout.scss';

const MenuLayout = (TagsList, ShortUrls, AsideMenu, CreateShortUrl, ShortUrlVisits) =>
  class MenuLayout extends React.Component {
    static propTypes = {
      match: PropTypes.object,
      selectServer: PropTypes.func,
      location: PropTypes.object,
      selectedServer: serverType,
    };

    state = { showSideBar: false };

    // FIXME Shouldn't use componentWillMount, but this code has to be run before children components are rendered
    /* eslint react/no-deprecated: "off" */
    componentWillMount() {
      const { match, selectServer } = this.props;
      const { params: { serverId } } = match;

      selectServer(serverId);
    }

    componentDidUpdate(prevProps) {
      const { location } = this.props;

      // Hide sidebar when location changes
      if (location !== prevProps.location) {
        this.setState({ showSideBar: false });
      }
    }

    render() {
      const { selectedServer, match } = this.props;
      const { params: { serverId } } = match;
      const burgerClasses = classnames('menu-layout__burger-icon', {
        'menu-layout__burger-icon--active': this.state.showSideBar,
      });
      const swipeMenuIfNoModalExists = (showSideBar) => () => {
        if (document.querySelector('.modal')) {
          return;
        }

        this.setState({ showSideBar });
      };

      return (
        <React.Fragment>
          <FontAwesomeIcon
            icon={burgerIcon}
            className={burgerClasses}
            onClick={() => this.setState(({ showSideBar }) => ({ showSideBar: !showSideBar }))}
          />

          <Swipeable
            delta={40}
            className="menu-layout__swipeable"
            onSwipedLeft={swipeMenuIfNoModalExists(false)}
            onSwipedRight={swipeMenuIfNoModalExists(true)}
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
                    component={ShortUrlVisits}
                  />
                  <Route
                    exact
                    path="/server/:serverId/manage-tags"
                    component={TagsList}
                  />
                  <Route
                    render={() => <NotFound to={`/server/${serverId}/list-short-urls/1`} btnText="List short URLs" />}
                  />
                </Switch>
              </div>
            </div>
          </Swipeable>
        </React.Fragment>
      );
    }
  };

export default MenuLayout;
