### Overview

This component offers patterned workflows when interacting with GraphQL as an orchestration application in which API data is abstracted from several sources. The first data source utilizes the JSON API from Drupal and uses the "Marvel Characters" content type. The second data source uses the Marvel API restful service to query and pull data for pertinent information about characters and comic books. The third data source pulls comic book sales from a restful service to display information about the character's comic data. This documentation will target the React piece of this architecture, but you can review the [GraphQL documentation](./graphql.md) for more insight on that piece.

<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/d68a9586-015d-4168-98ba-f702cdfa1ab5/00002921.png" />


### 'Marvel Characters' content fields in Drupal

```
Title  |  title | Text (plain)
Description |  field_description |  Text (formatted, long)
Image Reference |  field_image_reference |  Text (plain)
Marvel ID |  field_marvel_id |  Text (plain)
Nemesis |  field_nemesis |  Text (plain)
```

### Application structure and scaffolding


#### `src/components/App.js`

```
# The container is initially referenced using the ES6 `import` statement
import GraphQLClientMultiPage from '../containers/GraphQLClientMultiPage';
```

```
# The route is then added to the primary menu
<NavLink to="/graphqlclientmulti" activeStyle={activeStyle}>GraphQL Client (Multiple)</NavLink>
```

```
# The container is targeted for the route using the React Router module
<Route path="/graphqlclientmulti" component={GraphQLClientMultiPage} />
```

#### `src/containers/GraphQLClientMultiPage.js`

```
# Redux binding is imported for the container
import {connect} from 'react-redux';
```

```
# The component is then imported 
import GraphQLClientMultiApp from '../components/GraphQLClientMultiApp';
# Then rendered within the container as a component 
render() { ....
 <GraphQLClientMultiApp /> 
```

```
# The component is then connected to the Redux store
export default connect()(GraphQLClientMultiApp); 
```

#### `src/components/GraphQLClientMultiApp.js`

The GraphQL component file serves as the central point of execution for the visual elements of the structure. The core functionality revolves around the API action functions referenced as `../actions/graphqlMulti` in this file, which is stored in Redux and passed down to the inner components. Both the `Character` and `CreateCharacterForm` components are sub-components of this file and are passed both `props` and `state` from this parent component.

#### `src/components/CreateCharacterForm.js`

This component enables user input to add new Marvel characters to the subsequent components, by name and the association to that name. As with the prior component, data is pulled from the Redux object and passed through the `props` when interacting with the application. The `onUpdate` function is used to create a typeahead experience which is bound by pulling from a large matching data file. The `onSubmit` function is used for the execution of the name through the eventual mutation in GraqhQL.

#### `src/components/Character.js`

This component is used to list the various Marvel Drupal nodes which were served from GraphQL and previously retrieved from the Redux object and passed down to this component. This component also contains a nested component `Comics` which displays related information that is sourced from non-Drupal locations. The `render()` handles the typical `const` assignment for each of the high-level field matches, in addition to the nested data passed to the child component.

#### `src/components/Comic.js`

This component is used list the various comic book listings associated with the Marvel names from GraphQL. The component also displays nested sales data which is pulled from a separate API. The `onClick` function binds the container click event to hide or show the comic data under each listing. The `const` is assigned by utilizing the `map` assignment and then passed down to that nested component for display.


### GraphQL interaction

The primary execution of the API interaction is fired within the `src/components/GraphQLClientMultiApp.js` file. This is referenced in the file as `import * as actions from '../actions/graphqlMulti'` before binding within the standard Redux workflow. These actions are named according to their functionality in the `src/actions/graphqlMulti.js` file, as this file serves most of the Redux actions for each of the interactions. As per the standard Redux workflow, reducers are used as the final step to append the state. These reducers are `src/reducers/graphqlclientReducer.js` and `src/reducers/graphqlMulti.js`.

#### What is Apollo Client?

Apollo Client is a GraphQL client that is being used as a proxy layer in the application. It is designed from the ground up to make it easy to build UI components that fetch data with GraphQL. Apollo Client offers many benefits like correctly formed requests, marking properly updated cache, and schema consistency.


#### Constructing the GraphQL queries

The queries are stored in the `src/actions/graphqlclientActions.js` file and named according to their purpose. The query is written as a template literal tag using the `graphql-tag` package and then exported as a constant as in the following code.

The `characters` query pulls all existing characters which have been set up to synthesize all 3 API sources within the `GraphQLClientMultiApp` component.

```
export const fetchAll = gql`
  query {
    characters {
      id
      name
      description
      image
      comics {
        id
        title
        image
        description
        sales {
          issue
          count
        }
      }
    }
  }
`
```


The `CreateCharacter` mutation creates a new Marvel character when using the `CreateCharacterForm` component.


```
export const create = gql`
  mutation CreateCharacter($input: CharacterName!) {
    createCharacter(input: $input) {
      id
      name
      description
      image
      comics {
        id
        title
        image
        description
        sales {
          issue
          count
        }
      }
    }
  }
`
```

The `marvel` query is used in the typeahead dropdown when searching for characters using the `CreateCharacterForm` component.

```
const lookaheadQuery = gql`
  query {
    marvel {
      name
    }
  }
`
```

The `UpdateCharacter` mutation which updates existing Marvel Characters. This is not currently used in the workflow, but ready to be instantiated.

```
const update = () => {
  return gql`
    mutation UpdateCharacter($id: Int! $input: CharacterName!) {
      updateCharacter(id: $id input: $input) {
        title
      }
    }
  `
}
```

#### Executing the GraphQL queries

Each of the query functions is exported to be used in the `src/actions/graphqlMulti.js` file. The `fetchGraphql` function then calls the `fetchAll` function to receive the initial list when used in `componentDidMount` in `GraphQLClientMultiApp` and dispatches according to the reducer execution of the Redux store. The `createGraphql` function is instantiated from the `CreateCharacterForm` component when submitting the Marvel character to store in Redux, which is then stored by GraphQL back into Drupal thru the JSON API. The `lookahead` executes the GraphQL query to search for Marvel characters before submitting and is called within the `componentDidMount` in `GraphQLClientMultiApp`.

### External References & Resources 

- [Queries and Mutations - graphql.org](http://graphql.org/learn/queries/)
- [What is Apollo Client and what does it do?](https://www.apollographql.com/docs/react)
- [Why you might want a GraphQL client](https://dev-blog.apollodata.com/why-you-might-want-a-graphql-client-e864050f789c)
- [graphql-tag - github reference](https://github.com/apollographql/graphql-tag)
