import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select';

import '../styles/select.scss'

class CreateCharacterForm extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '' }
    this.onUpdate = this.onUpdate.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onUpdate(selected) {
    this.setState({ name: selected.name })
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.state.name.length > 0) {
      this.props.handleSubmit(this.state.name)
    }
    this.setState({ name: '' })
  }

  render() {
    const { lookahead } = this.props
    const { name } = this.state

    return (
      <form onSubmit={this.onSubmit}>
        <div className="row">
          <Select
            name="character-name"
            value={name}
            onChange={this.onUpdate}
            options={lookahead}
            valueKey='name'
            labelKey='name'
            openOnClick={false}
          />
          <p style={{ fontSize: "small" }}>Enter a valid Marvel character, this will instruct the GraphQL server to update its database with values from the Marvel API based on the character name.</p>
          <input type="submit" value={`Add ${name}`} />
        </div>
      </form>
    )
  }
}

CreateCharacterForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  lookahead: PropTypes.array.isRequired
}

export default CreateCharacterForm
