import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { pick } from 'ramda';
import Swipeable from 'react-swipeable';
import burgerIcon from '@fortawesome/fontawesome-free-solid/faBars';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import * as PropTypes from 'prop-types';
import ShortUrlsVisits from '../short-urls/ShortUrlVisits';
import { selectServer } from '../servers/reducers/selectedServer';
import CreateShortUrl from '../short-urls/CreateShortUrl';
import ShortUrls from '../short-urls/ShortUrls';
import './MenuLayout.scss';
import TagsList from '../tags/TagsList';
import { serverType } from '../servers/prop-types';
import AsideMenu from './AsideMenu';

export class MenuLayoutComponent extends React.Component {
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
    const { selectedServer } = this.props;
    const burgerClasses = classnames('menu-layout__burger-icon', {
      'menu-layout__burger-icon--active': this.state.showSideBar,
    });

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
          onSwipedLeft={() => this.setState({ showSideBar: false })}
          onSwipedRight={() => this.setState({ showSideBar: true })}
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
                <Route
                  exact
                  path="/server/:serverId/manage-tags"
                  component={TagsList}
                />
              </Switch>
            </div>
          </div>
        </Swipeable>
      </React.Fragment>
    );
  }
}

const MenuLayout = compose(
  connect(pick([ 'selectedServer', 'shortUrlsListParams' ]), { selectServer }),
  withRouter
)(MenuLayoutComponent);

export default MenuLayout;
