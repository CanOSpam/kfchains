/* eslint-disable import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { Switch, NavLink, Route } from 'react-router-dom';
import HomePage from './HomePage';
import DrupalCrudPage from '../containers/DrupalCrudPage';
import GraphQLClientDrupalPage from '../containers/GraphQLClientDrupalPage';
import GraphQLClientMultiPage from '../containers/GraphQLClientMultiPage';
import APIDataFailoverPage from '../containers/APIDataFailoverPage';
import APIDataMockPage from '../containers/APIDataMockPage';
import ChatBotPage from '../containers/ChatBotPage'
import UserAccessPage from '../containers/UserAccessPage'

import NotFoundPage from './NotFoundPage';

class App extends React.Component {
  render() {
    const activeStyle = { color: 'lightblue' };
    return (
      <div className="bodycontainer">
        <div className="nav-bar">
          <ul className="menu">
            <li><NavLink exact to="/" activeStyle={activeStyle}>Home</NavLink></li>
            <li><NavLink to="/drupalcrud" activeStyle={activeStyle}>Drupal CRUD</NavLink></li>
            <li><NavLink to="/graphqlclientsingle" activeStyle={activeStyle}>GraphQL Client (Single)</NavLink></li>
            <li><NavLink to="/graphqlclientmulti" activeStyle={activeStyle}>GraphQL Client (Multiple)</NavLink></li>
            <li><NavLink to="/apidatafailover" activeStyle={activeStyle}>API Data Failover</NavLink></li>
            <li><NavLink to="/apidatamock" activeStyle={activeStyle}>API Data Mock</NavLink></li>
            <li><NavLink to="/chatbot" activeStyle={activeStyle}>Chatbot Integration</NavLink></li>
            <li><NavLink to="/uac" activeStyle={activeStyle}>{'User content'}</NavLink></li>
          </ul>
        </div>
        <div className="content-container">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/drupalcrud" component={DrupalCrudPage} />
            <Route path="/graphqlclientsingle" component={GraphQLClientDrupalPage} />
            <Route path="/graphqlclientmulti" component={GraphQLClientMultiPage} />
            <Route path="/apidatafailover" component={APIDataFailoverPage} />
            <Route path="/apidatamock" component={APIDataMockPage} />
            <Route path="/chatbot" component={ChatBotPage} />
            <Route path="/uac" component={UserAccessPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;
