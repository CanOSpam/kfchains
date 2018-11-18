## Decoupled Starter Kit for React

The React application piece of the Decoupled architecture focuses on the following deliverables:

- Provide a sibling application to the GraphQL and Drupal applications to work in parallel when executing development tasks
- Provide a baseline application to be used as a boilerplate with common React and Redux tasks
- Organize components and associated code to properly communicate architecture scenarios
- Incorporate modern JavaScript techniques with tooling and technologies stack


### How is the code structured?

The application was developed on top of the [React Slingshot](https://github.com/coryhouse/react-slingshot) project by Cory House. The baseline structure is extended by a combination of packages located in the `src/` directory. Standard NPM build tasks are executed by `package.json` and organized by functional purpose. More details will be provided in the [architecture documentation](react-architecture.md).


### Which architectural workflows are covered?


#### Drupal CRUD Operations

This section covers workflows for interacting directly with the JSON API module in Drupal. These operations are separated in the code and noted according to standard CRUD (create, read, update, delete) purposes. This page targets the "Dogs" content type which is stored in the Drupal CMS for these operations. The application intentionally targets only simple text and image fields to provide working examples of requirements when interacting with the endpoints. These straightforward examples utilize interactions with OAuth 2.0 headers and validations according to common security handshake practices. Code specifics and references will be covered in the [Drupal CRUD Operations](react-drupalcrud.md) document.

#### Drupal GraphQL (Single)

This section covers workflows for interacting with GraphQL that derives its content from a single data source. In this case, the single source of data is the Drupal JSON API endpoint(s). This workflow exhibits a workable example when using GraphQL as an orchestration layer instead of dealing directly with Drupal, as shown in the previous CRUD example. This page uses the designated "Pokemon" content type in Drupal to interact with the React application. The application fetches data from the GraphQL designation and displays it as a list of nodes with all the pertinent fields. The application then shows a straightforward example of comparing this data by strength and weakness. Code specifics and references will be covered in the [Drupal GraphQL (Single)](react-graphqlsingle.md) document.


####  Drupal GraphQL (Multiple)

This section covers workflows for interacting with GraphQL that exposes content from many sources. It is intended to build on the previous example to contrast the usefulness of GraphQL when orchestrating multiple data sources versus a single API. This page uses the designated "Marvel" content type in Drupal to retrieve and store data by leveraging multiple APIs that serve related content. The user can then search and add new Marvel characters, while automatically including related comic book data. Code specifics and references will be covered in the [Drupal GraphQL (Multiple)](react-graphqlmultiple.md) document.
 

####  API Failover Techniques

This section covers a working example of storing API data for scenarios when the API is available or slow internet connectivity is an issue. The methods being used are `Cache API`, `localStorage`, and `IndexedDB`. The application uses a designated variable in your local `.env` file to trigger the storage, along with the user selection of each method. Each of the failover examples uses the "Client" content type in Drupal to retrieve and display the data for the proper purpose. Code specifics and references will be covered in the [API Failover Techniques](react-apifailover.md) document.


####  API Mocking Techniques

This section covers technical examples for creating and displaying Mock API data. Mock APIs are typically leveraged as a local development tool to address limitations with rate limits, under-development data structures not ready for production, and structural gaps during the SDLC cycle. The workflow uses the Apollo engine to serve data from GraphQL by declaring a type system to match production APIs. This application emulates the "Client" content type in Drupal to create dynamic data for local testing tasks. Code specifics and references will be covered in the [API Mocking Techniques](react-apimock.md) document.


####  Chatbot Integration

This section covers technical tasks around incorporating a chatbot application. This application utilizes data from a designated "Pokemon" content type in Drupal to interact with. The chatbot defines simple cases of data retrieval and data comparison. Code specifics and references will be covered in the [Chatbot](react-chatbot.md) document.
