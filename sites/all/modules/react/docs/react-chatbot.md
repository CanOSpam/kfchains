### Overview

This component demonstrates another client that is integrated with the data provided by Drupal. In our example, the React application includes an embedded iframe from Dialogflow. It shows that by decoupling you have an API ready for other applications to integrate with and begin presenting data in other formats.

### Application structure and scaffolding

### `src/components/App.js`

```
# The container is initially referenced using the ES6 `import` statement
import ChatBotPage from '../containers/ChatBotPage'
```

```
# The route is then added to the primary menu
<NavLink to="/chatbot" activeStyle={activeStyle}>Chatbot</NavLink>
```

```
# The container is targeted for the route using the React router module
<Route path="/chatbot" component={ChatBotPage}>
```

#### `src/containers/ChatBotPage.js`

As this component is just presenting an iframe for the chatbot we haven't broken the container into container:components as you would normally for a redux component. We simply embed the iframe directly and allow the iframe to perform the interactions as defined in Dialogflow.

```
# Redux binding is imported for consistency
import { connect } from 'react-redux'
```

```
# The iframe is embeded into the render() method
<iframe src="{x}"></iframe>
```

```
The component is then connected to the Redux store and exported
export default connect()(ChatBotPage)
```

### Dialogflow

Dialogflow (previously api.ai) is a voice and text-based conversational interface that easily allows you to develop applications for connected devices (such as Alexa or Google Assistant). These applications can also be embedded into the web to provide text-based interactions.

It allows you to create intents and entities which act as triggers and variables when passed to your script. An intent trigger is a particular function and is given the user input. You can use this input to request additional information from an API to provide a valuable repsponse to the visitor.

#### Fulfillment

Dialogflow provides a script engine for defining how an intent is fulfilled. This script is where we engage our GraphQL server for additional information on how to respond to the user.

The fulfillment scripts allow npm packages to be used.

```
# import the graphql client
const graphqlFetch = require('graphql-fetch')('http://path-to-graphql.com/graphql')
```

```
'input.pokmon_stats': () => {
  const query = `
    query q (title: String!) {
      user(title: $title) {
        title
        speed
        hp
        defense
        special_defense
        attack
        special_attack
        pokemon_height
        pokemon_weight
      }
    }
  `
  const queryVars = {
    title: parameters['pokemon-name']
  }

  return graphqlFetch(query, queryVars).then(pkmn => {
    return sendResponse(pkmn[parameters['stat']])
  })
}
```

### GraphQL interaction

In this example the React application isn't interacting with the GraphQL server, this is being done by Dialogflow.

### Constructing the GraphQL query

```
const query = `
  query q (title: String!) {
    user(title: $title) {
      title
      speed
      hp
      defense
      special_defense
      attack
      special_attack
      pokemon_height
      pokemon_weight
    }
  }
`
const queryVars = {
  title: parameters['pokemon-name']
}
```

### External resources

- [Build your first app with Dialogflow](https://developers.google.com/actions/dialogflow/first-app)
- [Dialogflow](https://dialogflow.com/)
- [Getting started with Dialogflow fullfillment](https://dialogflow.com/docs/how-tos/getting-started-fulfillment)
