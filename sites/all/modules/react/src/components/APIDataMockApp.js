import React from 'react';
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/graphqlMockActions';
import Client from './Client';
import '../styles/apidatamock.scss';

class APIDataMockApp extends React.Component {

  componentDidMount() {
    this.props.actions.fetchUsersAction()
  }

  render() {
    const { data } = this.props;

    const mockUsers = data.map((user, i) => {
      return (
        <Client key={i} firstName={user.first_name} lastName={user.last_name} email={user.email} country={user.country} uuid='not-a-real-uuid' />
      )
    })

    return (

      <div className="holder">

        <h4>Mocking APIs for local development</h4>
        <p>
          <b>Story:</b> As a developer, I want understand the usefulness of using a Mock API when developing API-reliant applications in React.
           I would like to understand how this Mock API is constructed and executed for local build tasks only, when using a local variable in my .env file.
        </p>

        {mockUsers}

      </div>

    );
  }
}

APIDataMockApp.propTypes = {
  data: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

export function mapStateToProps(state) {
  const { graphqlMockReducer: { data, msg } } = state
  return { data, msg }
}

export function MapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, MapDispatchToProps)(APIDataMockApp);
