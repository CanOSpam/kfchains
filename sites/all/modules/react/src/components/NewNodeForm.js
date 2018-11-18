import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import ReactQuill from 'react-quill'

class NewNodeForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      body: '',
      field_history_and_background: '',
      uploadedFile: '',
      formErrors: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault();
    const { onSubmit } = this.props
    const { title, body, field_history_and_background } = this.state
    const formErrors = {}

    if (title == '') {
      formErrors.title = 'You need to enter a title'
    }

    if (body == '') {
      formErrors.body = 'You need to enter some body text'
    }

    if (field_history_and_background == '') {
      formErrors.field_history_and_background = 'You need to enter history and background'
    }

    if (Object.keys(formErrors).length > 0) {
      this.setState({ formErrors });
      return;
    }

    onSubmit(this.state);
    this.setState({
      title: '',
      body: '',
      field_history_and_background: '',
      uploadedFile: ''
    })
  }

  onDrop(accepted) { // rejected
    // const uploadedFile = this.state.uploadedFile;
    accepted.forEach(file => {
      const Reader = new FileReader();
      Reader.readAsDataURL(file)
      Reader.onloadend = () => {
        this.setState({
          uploadedFile: {
            image: Reader.result,
            name: file.name
          }
        })
      }
    })
  }

  render() {
    const { title, body, field_history_and_background, formErrors } = this.state
    // const { onSubmit } = this.props

    return (
      <form onSubmit={this.handleSubmit} className="errors">
        <div className="row clearfix">
          <span className="api-source-drupal">Drupal API</span>
          <h5>Create a Node</h5>
          <ul className="form-errors">
            {Object.keys(formErrors).map((fieldName, i) => {
              return (<li key={i}><strong>{fieldName}</strong> {formErrors[fieldName]}</li>)
            })}
          </ul>
          <div>
            <div className="label">{"Title"}</div>
            <input type="text" name="title" value={title} onChange={function (event) { this.setState({ title: event.target.value }) }.bind(this)} />
          </div>
          <div>
            <div className="label">{"Body"}</div>
            <ReactQuill
              value={body}
              onChange={function (text) { this.setState({ 'body': text }) }.bind(this)}
            />
          </div>
          <div className="label">{"History and Background"}</div>
          <ReactQuill
            value={field_history_and_background}
            onChange={function (text) { this.setState({ 'field_history_and_background': text }) }.bind(this)}
          />
          <div className="label">{"Image"}</div>
          <span className="img-preview">
            <Dropzone onDrop={this.onDrop.bind(this)}><p>Drop and image to upload</p></Dropzone>
            <div className="image-preview"> {this.state.uploadedFile ? (<img src={this.state.uploadedFile.image} />) : ''} </div>
          </span>
          <div className="submit-node clearix">
            <input type="submit" value="Create New Node >" />
          </div>
        </div>
      </form>
    );
  }
}

NewNodeForm.propTypes = {
  onChangeHandler: PropTypes.string,
  handleSubmit: PropTypes.func,
  onDrop: PropTypes.func,
  onSubmit: PropTypes.func
}

export default NewNodeForm;
