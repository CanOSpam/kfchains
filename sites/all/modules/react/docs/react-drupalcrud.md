
### Overview

This component addresses technical requirements and patterned workflows for interacting directly with the JSON API module in Drupal. The code samples target the "Dogs" content type but can be replicated for other content types and fields. This application does <u>not</u> suggest replacing the editorial experience in Drupal but provides examples of JSON API interactions for functionality which provides more utility by nature.

### 'Dogs' content fields in Drupal

```
Title  |  Text (plain)
Description (Body)  |  Text (formatted, long, with summary)
History and Background  |  Text (formatted, long, with summary)
Dog Picture  |  Image	
```

### Application structure and scaffolding

#### `src/components/App.js`

```
# The container is initially referenced using the ES6 `import` statement
import DrupalCrudPage from '../containers/DrupalCrudPage';`
```

```
# The route is then added to the primary menu
<NavLink to="/drupalcrud" activeStyle={activeStyle}>Drupal CRUD</NavLink> 
```

```
# The container is targeted for the route using the React Router module
<Route path="/drupalcrud" component={DrupalCrudPage} />
```

#### `src/containers/DrupalCrudPage.js`

```
# Redux binding is imported for the container
import {connect} from 'react-redux';
```

```
# The Drupal CRUD component is then imported 
import DrupalCrudApp from '../components/DrupalCrudApp';
# Then rendered within the container as a component 
render() { ....
 <DrupalCrudApp /> 
```

```
# The component is then connected to the Redux store
export default connect()(DrupalCrudPage); 
```

#### `src/components/DrupalCrudApp.js`

This Drupal CRUD component file is the primary point of execution, as well as the key UI render piece of the structure. The core functionality revolves around the execution of the API functions referenced as `../actions/drupalAPIActions` in this file, which is stored in Redux and passed down to the inner components. The 'Node' list component and 'Node form' components are referenced and eventually rendered by receiving `props` and `state` from this component.


#### `src/components/Node.js`

The component lists the various Drupal nodes, which were previously pulled from the Redux object and passed down to this level. This component uses `react-quill` for the WYSIWYG fields and `react-dropzone` to handle image uploads. The component serves functionality for presenting the API data, in addition to updating the API source. 

#### `src/components/NewNodeForm.js`

The component allows users to create new Drupal Nodes by posting through the JSON API endpoints. As with the prior component, data is pulled from the Redux object and passed thru the `props` when interacting with the application. This component also uses `react-quill` for the WYSIWYG fields and `react-dropzone` to handle image uploads.


### JSON API interaction

The primary execution of the JSON API interaction is fired within the `src/components/DrupalCrudApp.js` file. This is referenced in this file as `import * as actions from '../actions/drupalAPIActions'` before binding within the standard Redux workflow. These actions are named according to their functionality in the `src/actions/drupalAPIActions.js` file, which serves most of the Redux actions for each of the interactions. As per the standard Redux workflow, reducers utilized as the final step to append the state. These reducers are `src/reducers/drupalLoadReducer.js` and `src/reducers/drupalLoadImgReducer.js`.


#### Creating Drupal Nodes (<u>C</u>RUD)

When successfully posting a new Drupal node within `src/components/DrupalCrudApp.js`, the `createContent` action is executed within the `onNewNodeSubmit` function. This function then returns a `dispatch` update for the API data, which is accomplished using the `drupalAPI` that was imported in this same file. The `src/api/drupalAPI.js` assists in generating OAuth tokens and declaring these headers in the `POST` request.


#### Retrieving Drupal Nodes (C<u>R</u>UD)

Retrieving the current list of Drupal nodes thru the API is accomplished in the `doLoadDrupalData` function in `DrupalCrudApp.js` when the component mounts. This function originates from the `src/actions/drupalAPIActions.js` file and retrieves data from the external API endpoints using `fetch` and `Promise` techniques. The `src/api/drupalAPI.js` file handles generating OAuth tokens and declaring these headers as with the operations.
    
#### Updating Drupal Nodes (CR<u>U</u>D)

Updating an existing Drupal node is executed in the `updateContent` function in the `DrupalCrudApp.js` file based on the `onChange` binding.  This function originates from the `src/actions/drupalAPIActions.js` file and executes the update by using the `drupalAPI.updateDrupal` method. This `updateDrupal` method originated in the `src/api/drupalAPI.js` file, which handles generating OAuth tokens and declaring the `Patch` header with the operation.

#### Deleting Drupal Nodes (CRU<u>D</u>)

Deleting an existing Drupal node is executed in the `deleteContent` function by passing the `uuid` in the `DrupalCrudApp.js` file based on the `onRemoveHandler` binding. The `deleteContent` originates in the `src/actions/drupalAPIActions.js` file and uses the `drupalAPI.deleteNode` method to perform a `DELETE` method as a `fetch`. The `fetch` is executed in the `src/api/drupalAPI.js` file, which handles generating OAuth tokens and declaring the `Patch` header with the operation.

### External References & Resources 

- [The React + Redux Container Pattern](http://www.thegreatcodeadventure.com/the-react-plus-redux-container-pattern/)
- [React-Redux: understanding the data flow](https://medium.com/@holtkam2/react-redux-understanding-the-data-flow-fd700b6bd56f)
- [Promise - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Using Fetch - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [JSON API - Drupal.org](https://www.drupal.org/project/jsonapi)
- [GET, POST, PATCH and DELETE - Drupal.org](https://www.drupal.org/docs/8/modules/json-api/get-post-patch-and-delete)
