import React, { Component } from 'react'
import { connect } from 'react-redux'

import LoginForm from '../components/LoginForm'

export class UserAccessPage extends Component {
  render() {
    return (
      <div className="boxy float-left clearfix">
        <h4>User Access Page</h4>
        <p><strong>Story:</strong> As a website owner I want to offer premium content to paid users so that I can make revenue</p>
        <p>To protect APIs from unauthorised access the OAuth specification has been created. The Drupal implementation of an OAuth server allows scopes to be defined using Drupal roles. This allows us to provide gated access to content based on the user who has authenticated with the site.</p>

        <div className="note">
          <p><strong>Available users:</strong> (<em>username:password</em>)</p>
          <ul>
            <li>premium:premium</li>
            <li>standard:standard</li>
          </ul>
        </div>

        <LoginForm />

      </div>
    )
  }
}

export default connect()(UserAccessPage)