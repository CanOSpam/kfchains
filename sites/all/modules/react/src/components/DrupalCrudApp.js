import React from 'react'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as actions from '../actions/drupalAPIActions'
import Node from './node';
import NewNodeForm from './NewNodeForm';
import '../styles/drupalcrud.scss'

class DrupalCrudApp extends React.Component {

  componentDidMount() {
    this.props.actions.doLoadDrupalData();
  }

  onChange(item, field, val) {
    this.props.actions.updateContent(item, field, val);
  }

  onNewNodeSubmit(item) {
    this.props.actions.createContent(item);
  }

  onRemoveHandler(uuid) {
    this.props.actions.deleteContent(uuid);
  }

  render() {
    const data = {...this.props.data};
    const nodeList = Object.keys(data).map(key => {
      const item = data[key];
      return (
        <Node
          key={key}
          image={item.image}
          onChangeHandler={this.onChange.bind(this) }
          onRemoveHandler={this.onRemoveHandler.bind(this)}
          {...item.attributes}
        />
      );
    })
    const Message = (this.props.message) ? (
      <div className="messages">
        <div className="message-inner">{this.props.message}</div>
      </div>
    ) : '';

    return (
      <div>
        <h4>Drupal CRUD Component</h4>
        <p>
          <b>Story:</b> As a developer, I want to understand common CRUD operations when interacting with Drupals JSON API endpoints from a Headless Lightning Drupal instance. I would like these tasks are broken out by core CRUD (Create, Read, Update, Delete) tasks for rich text and images fields. I do not want to replace Drupal strengths around content authoring, but rather seeks to understand workflows around interacting with API content.
        </p>
        <p><a href="#newnode">Example 1: Creating a new node</a> <br />
        <a href="#reviewupdate">Example 2 & 3: Review and Update and existing Node</a> <br />
        <a href="#delete">Example 4: Delete an existing Node</a> <br />
        </p>
        <br />
        <div className={"node-rows"}>
        <a name="newnode"></a>
          <NewNodeForm onSubmit={this.onNewNodeSubmit.bind(this)} />
        </div>
        <div className={"node-rows"}>
          <a name="reviewupdate"></a>
          {nodeList}
          <a name="delete"></a>
        </div>
        {Message}
      </div>
    );
  }
}

DrupalCrudApp.propTypes = {
  actions: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  message: PropTypes.string
};

function mapStateToProps(state) {
  const { drupalLoadReducer: { data } } = state || { drupalLoadReducer: {data: {}}}
  const { drupalLoadReducer: { message } } = state || { drupalLoadReducer: {message: ''}}
  return { data, message };
}

function MapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, MapDispatchToProps)(DrupalCrudApp);
