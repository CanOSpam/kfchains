
## Getting Started with the Decoupled React Application

### About 

The Decoupled Kit architecture was built to explore and communicate common workflows when building headless applications with Drupal's API. The build recipe and structure extends the popular [React Slingshot](https://github.com/coryhouse/react-slingshot) project. This application has included a considerable amount of features to be leveraged as best practices around workflow, structure, testing, and much more. The examples are intentionally basic to provide clarity around the intents of the components.

### Installation Requirements

- [Node.js](https://nodejs.org) (includes npm)
<!--- [Composer](https://getcomposer.org)-->
- [Git](https://git-scm.com/downloads)
- [Yarn](https://yarnpkg.com) (optional to npm)

### Installation Steps

- Navigate to the repository root
- Install package dependencies with `yarn install` or `npm install`
- Rename the file `.env.example` to `.env` in the project root. 
- Stand up the application with `yarn start` or `npm start` and visit `http://localhost:8080`

#### About the .env file

As stated in the installation steps, you will copy `.env.example` to `.env`. For the React application, this file already includes the proper environment variables to connect to the Drupal website (assuming you imported the provided database). You are free to update and noted below are the locations  of the existing values. 

```
DRUPAL_URL // URL of the Drupal Website
# http://local.decoupledkit.com/admin/config/services/consumer 
DRUPAL_USER // username of the consumer 
DRUPAL_PASSWORD // password of the consumer 
CLIENT_SECRET // secret of the consumer
CLIENT_ID // UUID of the consumer
```


#### Technologies & Tools Documentation 
- [React](https://facebook.github.io/react/)
- [Redux](http://redux.js.org) 
- [React Router](https://github.com/reactjs/react-router)
- [Babel](http://babeljs.io) 
- [Webpack](https://webpack.js.org) 
- [Browsersync](https://www.browsersync.io/)
- [Jest](https://facebook.github.io/jest/)
- [TrackJS](https://trackjs.com/)
- [ESLint](http://eslint.org/)
- [SASS](http://sass-lang.com/)
- [PostCSS](https://github.com/postcss/postcss)
- [Editor Config](http://editorconfig.org)
- [NPM Build Scripts](https://docs.npmjs.com/misc/scripts)


#### Optional Developer Plugins

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Redux DevTools for Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) 
- [Apollo Client Devtools](https://github.com/apollographql/apollo-client-devtools)

