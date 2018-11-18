## Decoupled GraphQL Architecture Overview

The GraphQL element of the Decoupled architecture focuses on the following deliverables: 

- Provide a collection of queries that serve data in a standardized manner
- Facilitate data from Drupal's JSON API for various content types and fields
- Retrieve and serve data from multiple non-Drupal web services to synthesize with Drupal data 
- Update Drupal content type data thru mutations based on user input with JSON API 

<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/8a8d41a2-3fbd-4b52-8be0-4528e827623b/00002926.png" />

### Description of GraphQL

"GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools." -- [https://graphql.org](https://graphql.org)

### How is GraphQL being used in this architecture?

A simple Node.js application uses Express to create a layer that facilitates the GraphQL framework. One of GraphQL's many strengths is refining multiple resources in a single request, so this application allows for standardizing both Drupal and non-Drupal API data into a combined query. The application also is constructed to expose mock data when developing locally. The functionality of an "Orchestration" component is the primary focus of GraphQL within this architecture.

<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/80dc01d4-1d52-4533-b848-5bedbc47dbd3/00002927.png" />
