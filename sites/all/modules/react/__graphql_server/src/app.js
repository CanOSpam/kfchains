import express from 'express';
import bodyParser from 'body-parser';
import  { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { Engine } from 'apollo-engine'

import schema from './schema';

const cors = require('cors');
const app = express();
const port = process.env.PORT || 8082;

const engine = new Engine({engineConfig: {
  apiKey: process.env.APOLLO_ENGINE,
  stores: [{
    "name": "publicResponseCache",
    "inMemory": {
      "cacheSize": 100000000
    }
  }],
  queryCache: {"publicFullQueryStore": "publicResponseCache"}
}});

engine.start();

/**
 * --- Middleware Registratoin ---
 */

// Apollo server provides caching and performance tracing through their engine
// this ensures that the express server will spawn the necessary apollo engine
// process when the application is starting and allows us to use cache hinting
// when defining schema options.
app.use(engine.expressMiddleware())

// Ensure that the server can handle CORS requests.
app.use(cors());

/* --- */

/**
 * --- Route definition ---
 * @TODO: Consider moving to a module pattern for routes so the main application
 * file is not altered during development.
 */
app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  tracing: true,
  context: {},
  cacheControl: true
}));

// graphiql - this is a dev route and exposes a graphql explorer.
app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
}));

app.get('/', function(req, res) {
  res.send('This is a GraphQL Demo Server ~ !<br><a href="/graphiql">click here</a> to test with the GraphQL API UI.');
});

// TODO // add all the queries in documentation

/* --- */

/*eslint-disable no-console */

app.listen(port, () => console.log(`Server on ${port}`));
