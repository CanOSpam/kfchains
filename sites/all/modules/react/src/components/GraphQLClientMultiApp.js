import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions/graphqlMulti'
import Character from './Character'
import CreateCharacterForm from './CreateCharacterForm'
import '../styles/graphqlclientdrupal.scss'

class GraphQLClientMulti extends React.Component {

  constructor(props, store) {
    super(props, store);
  }

  componentDidMount() {
    this.props.actions.fetchGraphql();
    this.props.actions.lookahead();
  }

  handleSubmit(character) {
    this.props.actions.createGraphql(character);
  }

  render() {
    const { data, message, lookahead } = this.props;

    const Characters = data.map(character => {
      return (
        <Character
          key={character.id}
          name={character.name}
          description={character.description}
          image={character.image}
          comics={character.comics}
          villains={character.villains}
        />
      )
    })

    let messages = (message) ? (<div className="messages"><div className="message-inner">{message}</div></div>) : '';

    return (

      <div className="holder">

        <h4>Using GraphQL to query a data from both a Headless Drupal source and external non-Drupal API.</h4>

        <p>
          <b>Story:</b> As a developer, I would like to understand the usefulness of utilizing a GraphQL server combine data from multiple API endpoints. I would like to understand how to setup the proper types and schema definitions to display this data. Using the GraphQL server we can demonstrate accessing information from different systems and exposing the data through a single interface for attached clients (this React application).
        </p>

        <div className="docs-refs clearfix">
          <div className="query-display">
            <span>Query sent to GraphQL server</span>
            {actions.fetchAll.loc.source.body}
          </div>
          <div className="query-display">
            <span>Mutation sent to GraphQL server</span>
            {actions.create.loc.source.body}
          </div>
          <img style={{ maxHeight: '420px' }} className="architecture-img" src={require('../img/graphql-multi-backend.svg?1')} />
        </div>

        <div className="comic-form-wrapper">
          <h4>Proxying data with GraphQL</h4>
          <p>The below form shows how to send a mutation to the GraphQL server. Mutations are a pattern defined by GraphQL to allow data updates to be sent and handled by the GraphQL server. This example showcases using data from one of the other attached systems and replicating the data in Drupal.</p>
          <CreateCharacterForm
            handleSubmit={this.handleSubmit.bind(this)}
            lookahead={lookahead}
          />
        </div>

        <br /> <hr />

        <h4>List of Marvel Characters</h4>

        <div className="characterlisting-wrapper">
          {Characters.length > 0 ? Characters : (<div className="preloader-1"><div>Loading</div>
            <span className="line line-1"></span>
            <span className="line line-2"></span>
            <span className="line line-3"></span>
            <span className="line line-4"></span>
            <span className="line line-5"></span>
            <span className="line line-6"></span>
            <span className="line line-7"></span>
            <span className="line line-8"></span>
            <span className="line line-9"></span></div>)}
          {messages}
        </div>

      </div>

    );
  }
}

GraphQLClientMulti.propTypes = {
  createGraphql: PropTypes.func,
  fetchGraphql: PropTypes.func,
  lookahead: PropTypes.array,
  data: PropTypes.array,
  message: PropTypes.string,
  actions: PropTypes.object,
}

export function mapStateToProps(state) {
  const { graphqlMultiReducer: { data, message, lookahead } } = state
  return { data, message, lookahead };
}

export function MapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, MapDispatchToProps)(GraphQLClientMulti);


