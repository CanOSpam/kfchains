import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactHtmlParser from 'react-html-parser'
import ReactQuill from 'react-quill'
import Dropzone from 'react-dropzone'

import '../styles/editorStyles.scss'

class Node extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemoveNode = this.handleRemoveNode.bind(this);
    this.toggleUpdate = this.toggleUpdate.bind(this);
    this.onDrop = this.onDrop.bind(this)

    this.state = {
      ...props,
      showUpdateForm: false,
      uploadedFiles: ''
    };
  }

  toggleUpdate() {
    const { showUpdateForm } = this.state;
    this.setState({
      showUpdateForm: !showUpdateForm,
    });
  }

  handleChange(event) {
    let state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  }

  handleSubmit(event) {
    const { onChangeHandler } = this.props;
    onChangeHandler(this.state.uuid, { ...this.state });
    this.setState({ showUpdateForm: false })
    event.preventDefault();
  }

  handleRemoveNode() {
    const { onRemoveHandler } = this.props;
    const { uuid } = this.state;
    onRemoveHandler(uuid);
  }

  _handleEditorChange(text, name) {
    this.setState({ [name]: text });
  }

  onDrop(acceptedFiles) { // RejectedFiles
    // const uploadedFiles = this.state.uploadedFiles;
    acceptedFiles.forEach(file => {
      const Reader = new FileReader()
      Reader.readAsDataURL(file)
      Reader.onloadend = () => {
        this.setState({
          uploadedFiles: {
            image: Reader.result,
            name: file.name
          }, image: Reader.result
        })
      }
    })
  }

  render() {

    const { showUpdateForm, nid, title, body, field_history_and_background, image } = this.state;

    return (
      <div className="row clearfix">

        {/* -------------------------------------- */}

        <div className="existing-node clearfix">

          <span className="api-source-drupal">Drupal API</span>

          <h5>Current Node</h5>

          <div className="nid">
            <div className="label">{"NID"}</div>
            {nid}
          </div>

          <div className="title">
            <div className="label">{"Title"}</div>
            {title}
          </div>
          <div className="body">
            <div className="label">{"Body"}</div>
            {(body.value) ? ReactHtmlParser(body.value) : ReactHtmlParser(body)}
          </div>
          <div className="history-and-background">
            <div className="label">{"History and background"}</div>
            {(field_history_and_background.value) ? ReactHtmlParser(field_history_and_background.value) : ReactHtmlParser(field_history_and_background)}
          </div>

          {image && (
            <div className="dog-picture">
              <div className="label">{"Picture"}</div>
              <img src={image} />
            </div>
          )}

        </div>

        {/* -------------------------------------- */}

        <hr className="separator clearfix" />

        {/* -------------------------------------- */}

        <input type="button" className="remove-node-btn float-right" onClick={this.handleRemoveNode} value={"Remove Node"} />
        <input type="button" className="update-node-btn float-right" onClick={this.toggleUpdate} value={"Update Node"} />

        {/* -------------------------------------- */}

        {showUpdateForm && (
          <div className="update-node clearfix">
            <form onSubmit={this.handleSubmit}>
              <p className="label"><strong>{"Title"}</strong></p>
              <input type={"text"} name="title" value={title} onChange={this.handleChange} />
              <p className="label"><strong>{"Body"}</strong></p>
              <ReactQuill
                value={body.value ? body.value : body}
                onChange={function (text) { this._handleEditorChange(text, 'body') }.bind(this)}
              />
              <p className="label"><strong>{"History and Background"}</strong></p>
              <ReactQuill
                value={field_history_and_background.value ? field_history_and_background.value : field_history_and_background}
                onChange={function (text) { this._handleEditorChange(text, 'field_history_and_background') }.bind(this)}
              />
              <p className="label"><strong>{"Images"}</strong></p>
              <span className="img-preview">
                <Dropzone onDrop={this.onDrop}>
                  <p>Drop image to upload</p>
                </Dropzone>
                {this.state.uploadedFiles && (
                  <div className="image-preview">
                    {this.state.uploadedFiles ? (<img src={this.state.uploadedFiles.image} />) : ''}
                  </div>
                )}
              </span>
              <div className="submit-node clearfix">
                <input type="submit" value="Save Changes thru API >" />
              </div>
            </form>
          </div>
        )}

      </div>
    )
  }
}

Node.propTypes = {
  onChangeHandler: PropTypes.func.isRequired,
  nid: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.shape({
    value: PropTypes.string.isRequired
  }),
  image: PropTypes.string,
  onRemoveHandler: PropTypes.func
}

export default Node;
