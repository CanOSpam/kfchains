
## GraphQL Application

### About 

The GraphQL application included in the architecture acts as a proxy or orchestration application with the working examples. The application is a simple Node.js application which uses Express and a handful of tools for GraphQL.  After installation, you can also test with the GraphQL API UI <a href="http://localhost:8082/graphiql">http://localhost:8082/graphiql</a>. The actual endpoint location to target from the React application is `http://localhost:8082/graphql`. 

### Installation Requirements

- [Node.js](https://nodejs.org) (includes npm)
<!--- [Composer](https://getcomposer.org)-->
- [Git](https://git-scm.com/downloads)
- [Yarn](https://yarnpkg.com) (optional to npm)
- Obtain a public and private key from the [Marvel Developer Portal](https://developer.marvel.com) 
- Obtain an Apollo Engine API key [here](http://engine.apollographql.com) after signing up


### Installation Steps

- Navigate to the GraphQL application root at `__graphql_server/`
- Install package dependencies with `yarn install` or `npm install`
- Rename the file `.env.example` to `.env` in the project root and update variables for marvel and apollo. 
- Run the server with `yarn start` or `npm start` and visit `http://localhost:8082`

#### About the .env file

As stated in the installation steps, you will copy `.env.example` to `.env`. For the GraphQL application, this file already includes most of the proper environment variables to connect each of the entities. The Drupal variables can also be referenced at [http://local.decoupledkit.com/admin/config/services/consumer](http://local.decoupledkit.com/admin/config/services/consumer) after installing the Drupal website locally.


```
# variables which need to be added... 
API_PUBLIC_KEY // Marvel API Public Key
API_PRIVATE_KEY // Marvel API Public Key
APOLLO_ENGINE // Apollo Engine API key

# variables not required to update...  
DRUPAL_URL // URL of the Drupal Website
PORT // GraphQL port 
MOCK // variable to activate Mock APIs
DRUPAL_USER // username of the consumer 
DRUPAL_PASSWORD // password of the consumer 
CLIENT_SECRET // secret of the consumer
CLIENT_ID // UUID of the consumer
```

#### Technologies & Tools Documentation 

- [GraphQL](https://graphql.org/)
- [Express](https://expressjs.com)
- [Apollo Client for React](https://www.apollographql.com/docs/react/)
- [GraphQL Tools](https://github.com/apollographql/graphql-tools)
- [Babel](https://babeljs.io/)
- [NPM Build Scripts](https://docs.npmjs.com/misc/scripts)


#### Optional Developer Plugins

<!--- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Redux DevTools for Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) -->
- [Apollo Client Devtools](https://github.com/apollographql/apollo-client-devtools)

