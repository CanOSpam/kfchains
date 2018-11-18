### Overview

This component offers patterned workflows when interacting with GraphQL as an orchestration application in which JSON API data originates from Drupal. The code samples target the "Pokemon" content type which is served by Drupal via GraphQL, but can be replicated for other content types and fields. This documentation will target the React piece of this architecture, but you can review the [GraphQL documentation](./graphql.md) for more insight on that piece.

### 'Pokemon' content fields in Drupal

```
Title  |  title | Text (plain)
Pokemon ID  |  field_pokemon_id  |  Number (integer)
Front Shiny (image sprite)  |  field_front_shiny_sprite  |  Text (plain)
Back Shiny (image sprite)  |  field_back_shiny_sprite  |  Text (plain)
Weight  |  field_weight_pokemon  |  Number (integer)
Height  |  field_height_pokemon  |  Number (integer)
HP  |  field_hp  |  Number (integer)
Attack  |  field_attack  |  	Number (integer)
Defense  |  field_defense  |  Number (integer)
Special Attack  |  field_special_attack  |  Number (integer)
Special Defense  |  field_special_defense  |  Number (integer)
Speed  |  field_speed  |  Number (integer)
Abilities  |  field_abilities  |  Entity reference (taxonomy)
Type  |  field_type_pokemon_ref  |  Entity reference (taxonomy)
```
	

### Application structure and scaffolding

#### `src/components/App.js`

```
# The container is initially referenced using the ES6 `import` statement
import GraphQLClientDrupalPage from '../containers/GraphQLClientDrupalPage';`
```

```
# The route is then added to the primary menu
<NavLink to="/graphqlclientsingle" activeStyle={activeStyle}>GraphQL Client (Single)</NavLink>
```

```
# The container is targeted for the route using the React Router module
<Route path="/graphqlclientsingle" component={GraphQLClientDrupalPage} />
```

#### `src/containers/GraphQLClientDrupalPage.js`

```
# Redux binding is imported for the container
import {connect} from 'react-redux';
```

```
# The component is then imported 
import GraphQLClientDrupalApp from '../components/GraphQLClientDrupalApp';
# Then rendered within the container as a component 
render() { ....
 <GraphQLClientDrupalApp /> 
```

```
# The component is then connected to the Redux store
export default connect()(GraphQLClientDrupalPage); 
```

#### `src/components/GraphQLClientDrupalApp.js`

The GraphQL component file serves as the central point of execution for the visual elements of the structure. The core functionality revolves around the API action functions referenced as `../actions/graphqlclientActions` in this file, which is stored in Redux and passed down to the inner components. Both the `Pokemon` and `PokemonCompare` list components are sub-components of this file and are passed both `props` and `state` from this parent component.

#### `src/components/Pokemon.js`

This component lists the various Pokemon nodes which were served from GraphQL and previously retrieved from the Redux object and passed down to this component. Its functionality focuses on presenting the GraphQL queried data as a list. The `showfull` state is used to toggle the full or partial visibility of the component according to the container classnames `minimal` or `full`. The `taxonomies` function is used to present both the 'abilities' and 'type' taxonomies as lists, along with their meta. The `base_stats` function is used to display the various integer fields of that character, along with a slight delta comparison. The `render()` handles the typical `const` assignment for each of the individual field matches, in addition to the locally scoped listing functions for taxonomies.

#### `src/components/PokemonCompare.js`

This component compares the same statical attributes for each Pokemon character that are collected as base stats. As with the prior component, data is pulled from the Redux object and passed thru the `props` when interacting with the application. The `handleClickStats` function binds the click event to compare as a simple `a to b` comparison operator. The `render()` handles the typical `const` assignment for each of the groupings according to the `dataset` which is stored in the inherited `state`.

### GraphQL interaction

The primary execution of the JSON API interaction is fired within the `src/components/GraphQLClientDrupalApp.js` file. This is referenced in this file as `import * as actions from '../actions/graphqlclientActions.js'` before binding within the standard Redux workflow. These actions are named according to their functionality in the `src/actions/graphqlclientActions.js` file, as this file serves most of the Redux actions for each of the interactions. As per the standard Redux workflow, reducers are used as the final step to append the state. These reducers are `src/reducers/drupalLoadReducer.js` and `src/reducers/drupalLoadImgReducer.js`.

#### What is Apollo Client?

Apollo Client is a GraphQL client that is being used as a proxy layer in the application. It is designed from the ground up to make it easy to build UI components that fetch data with GraphQL. Apollo Client offers many benefits like correctly formed requests, marking properly updated cache, and schema consistency.

#### Constructing the GraphQL query

The single query is called within the `src/actions/graphqlclientActions.js` file. The query is written as a template literal tag using the `graphql-tag` package and then exported as a constant as in the following code.

```
export const query = gql`
  query {
    pokemons {
      id
      nid
      pokemon_id
      title
      back_shiny_sprite
      front_shiny_sprite
      height_pokemon
      weight_pokemon
      hp
      attack
      defense
      special_attack
      special_defense
      speed
      abilities {
        id
        type
        name
        description
      }
      ref_types {
        id
        type
        name
        description
      }
    }
  }
`;
```

#### Executing the GraphQL query

The query function is exported to be used in the `src/actions/graphqlclientActions.js` file. This `fetchData` function then dispatches according to the beginning and received constants which are stored in the same file. The `BEGIN_GRAPHQL` and `RECEIVE_GRAPHQL` constants are then used to execute the timing of each scenario in the Redux store.


### External References & Resources 

- [Queries and Mutations - graphql.org](http://graphql.org/learn/queries/)
- [What is Apollo Client and what does it do?](https://www.apollographql.com/docs/react)
- [Why you might want a GraphQL client](https://dev-blog.apollodata.com/why-you-might-want-a-graphql-client-e864050f789c)
- [graphql-tag - github reference](https://github.com/apollographql/graphql-tag)
