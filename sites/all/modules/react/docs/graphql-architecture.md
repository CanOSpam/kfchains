## GraphQL Architecture

The GraphQL application is contained in the `__graphql_server` folder of the repository. This code was included in a subfolder to keep it segregated from the React application without the need for a separate codebase.

### Node.js application 

#### `__graphql_server/package.json`

As with standard Node application, the `package.json` serves as the manifest file for the application when the initial rendering occurs. The file includes the application's dependencies and versions. It also defines the build task as the standard `npm start` command. After installing the dependencies, the appropriate packages will be stored in the `node_modules` directory.

```
{
  "name": "graphql_demo",
  "version": "0.0.1",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "start": "node --require 'dotenv/config' --require 'babel-register' src/app.js"
  },
  "dependencies": {
    "apollo-engine": "0.8.9",
    "apollo-server-express": "^1.3.2",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-polyfill": "^6.26.0",
    "babel-preset-stage-0": "^6.24.1",
    "body-parser": "^1.18.2",
    "btoa": "^1.1.2",
    "cors": "^2.8.4",
    "dotenv": "^4.0.0",
    "express": "^4.16.2",
    "graphql": "^0.12.3",
    "graphql-modules": "^0.2.2",
    "graphql-tools": "^2.16.0",
    .........
```

#### `__graphql_server/.env`

The `.env` file is a environment file that allows users to store configuration variables that are not intended to be stored in code or publicly. This allows for contextual switching of runtime dependences in both local and production versions of the application. A sample `.env.example` is provided to communicate the variables needed when setting up locally. 

```
API_PUBLIC_KEY=***MARVELAPI**********
API_PRIVATE_KEY==***MARVELAPI**********
DRUPAL_URL=http://local.decoupledkit.com
APOLLO_ENGINE=***APOLLOKEY*******
PORT=8082
MOCK=true
DRUPAL_USER=apitest
DRUPAL_PASSWORD=apitest
CLIENT_SECRET=apitest
CLIENT_ID=be2557eb-bd73-4606-9a45-30b94a07019d
```


#### `__graphql_server/src/app.js`

The code for `app.js` is the primary JavaScript file of execution for the application. The file uses Express to serve the route for the single GraphQL endpoint `/graphql` and the graphql explorer `/graphiql`. The files also layer in the `apollo-engine` package to help with performance, caching, and metrics.


```
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
  ...............
```

#### `__graphql_server/data`

This folder stores any local `*.json` content files that are used within the GraphQL applications. A majority of the data is served from external APIs but a handful of local file options are included to demonstrate serving data from a localized data source.


#### `__graphql_server/src`

Other than the `app.js` file, the files stored in the `src/` folder are dedicated to the GraphQL functionality. Each of the GraphQl `types` (and subsequent functions) are stored separately in the `src/types` folder, while some are directly related to each other based on need. The API helper functions are located in `src/helper` and functionality revolves primarily around `fetch` methods from external sources.
