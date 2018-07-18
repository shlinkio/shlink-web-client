import React from 'react';
import { connect } from 'react-redux';
import './Home.scss';
import { resetSelectedServer } from '../servers/reducers/selectedServer';

export class Home extends React.Component {
  componentDidMount() {
    this.props.resetSelectedServer();
  }

  render() {
    return (
      <div className="home-container">
        <h1 className="home-container__title">Welcome to Shlink</h1>
        <h5 className="home-container__intro">Please, select a server.</h5>
      </div>
    );
  }
}

export default connect(null, { resetSelectedServer })(Home);
