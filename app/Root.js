/* global window */
import React, { Component } from 'react';
import { createStackNavigator, addNavigationHelpers } from 'react-navigation';
import { createStore, applyMiddleware, compose } from 'redux';
import {
  createReactNavigationReduxMiddleware,
  initializeListeners,
  createReduxBoundAddListener,
} from 'react-navigation-redux-helpers';
import { Provider, connect } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import firebase from 'firebase';

import { GOOGLE_FIREBASE_API_KEY } from './apis';
import reducers from './src/reducers';
import { RootNavigator } from './src/Router';
import NavigatorService from './src/Navigator';

const navReducer = (state, action) => {
  const newState = RootNavigator.router.getStateForAction(action, state);
  return newState || state;
};

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);

class App extends Component {
  componentDidMount() {
    initializeListeners("root", this.props.nav);
  }

  render() {
    const navigation = {
      dispatch: this.props.dispatch,
      state: this.props.nav,
      addListener: createReduxBoundAddListener('root'),
    };
    return (
      <RootNavigator 
        ref={navigatorRef => {
          NavigatorService.setContainer(navigatorRef);
        }}
        navigation={navigation}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav,
});

const AppWithNavigationState = connect(mapStateToProps)(App);

const store = createStore(
  reducers(navReducer),
  applyMiddleware(ReduxThunk),
);

class Root extends Component {
  componentWillMount() {
    const config = {
      apiKey: GOOGLE_FIREBASE_API_KEY,
      authDomain: 'pixelite-1505838442092.firebaseapp.com',
      databaseURL: 'https://pixelite-1505838442092.firebaseio.com',
      // projectId: 'manager-c381e',
      storageBucket: '',
      messagingSenderId: '779653227449',
    };
    firebase.initializeApp(config);
  }

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

export default Root;
