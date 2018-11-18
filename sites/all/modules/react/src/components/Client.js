import React, { Component } from 'react'
import PropTypes from 'prop-types'

import '../styles/client.scss'

class Client extends Component {
  render() {
    const { firstName, lastName, email, country, type } = this.props
    const classes = `snip1336 profile-${type}`

    return (
      <figure className={classes}>
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sample87.jpg" />
        <figcaption>
          <img src={require('../img/people.svg?1')} alt="profile-sample4" className="profile" />
          <h3>{firstName} {lastName}</h3>
          <p><a href="mailto:{email}">{email}</a></p>
          <p>{country}</p>
          {type ? <span className="badge">{type}</span> : ''}
        </figcaption>
      </figure>
    )
  }
}

Client.propTypes = {
  email: PropTypes.string,
  country: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  type: PropTypes.string
  // TODO: see what this is requiring as both string || number...
  // uuid: PropTypes.number.isRequired
}

export default Client
