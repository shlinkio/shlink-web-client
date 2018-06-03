import React from 'react';
import './App.scss';
import MainHeader from './common/MainHeader';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <MainHeader/>
        <div className="app">
          <h1 className="app__title">Welcome to Shlink</h1>
          <h5 className="App__intro">Please, select a server.</h5>
        </div>
      </div>
    );
  }
}
