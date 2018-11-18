### Overview

This component offers common workflows when interacting with Mock APIs for local development. Mock APIs are typically used (in a local environment build task) to avoid interactions with production API rate limits or API constructs which have not been finalized. The current architecture allows for the GraphQL application to serve the data, but options are available to serve the API from the current React application as well.


### Application structure and scaffolding


#### `src/components/App.js`

```
# The container is initially referenced using the ES6 `import` statement
import APIDataMockPage from '../containers/APIDataMockPage';
```

```
# The route is then added to the primary menu
<NavLink to="/apidatamock" activeStyle={activeStyle}>API Data Mock</NavLink>
```

```
# The container is targeted for the route using the React Router module
<Route path="/apidatamock" component={APIDataMockPage} />
```


#### `src/containers/APIDataMockPage.js`

```
# Redux binding is imported for the container
import {connect} from 'react-redux';
```

```
# The component is then imported 
import APIDataMockApp from '../components/APIDataMockApp';
# Then rendered within the container as a component 
render() { ....
 <APIDataMockApp /> 
```

```
# The component is then connected to the Redux store
export default connect()(APIDataMockPage); 
```

#### `src/components/APIDataMockApp.js`

This component file serves as the central point of execution for the visual elements of the structure. The core functionality revolves around the API action functions referenced as `../actions/graphqlMockActions` in this file, which is stored in Redux and passed down to the inner components. The component also includes the sub-component `Client` which is passed both `props` and `state` from this parent component.


#### `src/components/Client.js`

This component serves as the UI layer to render the stored data as a visual element for each of the 3 techniques. As with the prior component, data is pulled from the Redux object and passed through the `props` when interacting with the application.


### GraphQL interaction

The primary execution of the API interaction is within the file `src/actions/graphqlMockActions.js`. As with the other GraphQL components, the query is assisted by the Apollo Client package. The interaction with the mock API is consistent with a normal GraphQL call since the GraphQL application handles the actual data emulation for that request.

#### What is Apollo Client?

Apollo Client is a GraphQL client which is being used as a proxy layer in the application.  It is designed from the ground up to make it easy to build UI components that fetch data with GraphQL. Apollo Client offers many benefits like correctly formed requests, marking properly updated cache, and schema consistency.


#### Constructing the GraphQL query

The `fetchAll` `const` is stored using the `graphql-tag` template literal tag to be used within the Redux dispatch.

```
const fetchAll = () => {
  return gql`
    query {
      users {
        name
        email
        first_name
        last_name
        email
        country
        id
      }
    }
  `
}
```

#### Executing the GraphQL queries

The function is then stored for execution and then returned as a dispatch for Redux when called from `src/components/APIDataMockApp.js`. 

```
export const fetchUsersAction = () => {
  return dispatch => {
    const query = fetchAll()
    return client.query({ query })
      .then(data => {
        const { data: { users }} = data
        dispatch(endAction(users))
      })
  }
}
```


### External References & Resources

- [No API? No Problem! Rapid Development via Mock APIs](https://medium.freecodecamp.org/rapid-development-via-mock-apis-e559087be066)
- [Introduction to GraphQL - graphql.org](http://graphql.org/learn/)
- [What is Apollo Client and what does it do?](https://www.apollographql.com/docs/react)
- [Why you might want a GraphQL client](https://dev-blog.apollodata.com/why-you-might-want-a-graphql-client-e864050f789c)
- [graphql-tag - github reference](https://github.com/apollographql/graphql-tag)
