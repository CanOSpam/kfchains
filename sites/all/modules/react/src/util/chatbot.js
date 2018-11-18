'use strict';

const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library

const graphqlFetch = require('graphql-fetch')('http://a8a1abb6.ngrok.io/graphql')

const pkmnData = {
  "data": {
    "pokemons": [
      {
        "attack": 82,
        "defense": 83,
        "height_pokemon": 20,
        "hp": 80,
        "special_attack": 100,
        "speed": 80,
        "title": "venusaur",
        "weight_pokemon": 1000
      },
      {
        "attack": 95,
        "defense": 85,
        "height_pokemon": 20,
        "hp": 95,
        "special_attack": 125,
        "speed": 55,
        "title": "exeggutor",
        "weight_pokemon": 1200
      },
      {
        "attack": 107,
        "defense": 122,
        "height_pokemon": 16,
        "hp": 88,
        "special_attack": 74,
        "speed": 64,
        "title": "chesnaught",
        "weight_pokemon": 900
      },
      {
        "attack": 45,
        "defense": 48,
        "height_pokemon": 6,
        "hp": 70,
        "special_attack": 60,
        "speed": 35,
        "title": "clefairy",
        "weight_pokemon": 75
      },
      {
        "attack": 30,
        "defense": 40,
        "height_pokemon": 3,
        "hp": 45,
        "special_attack": 105,
        "speed": 20,
        "title": "solosis",
        "weight_pokemon": 10
      },
      {
        "attack": 80,
        "defense": 35,
        "height_pokemon": 5,
        "hp": 40,
        "special_attack": 35,
        "speed": 70,
        "title": "mankey",
        "weight_pokemon": 280
      },
      {
        "attack": 75,
        "defense": 110,
        "height_pokemon": 16,
        "hp": 95,
        "special_attack": 100,
        "speed": 30,
        "title": "slowbro",
        "weight_pokemon": 785
      },
      {
        "attack": 80,
        "defense": 50,
        "height_pokemon": 9,
        "hp": 80,
        "special_attack": 40,
        "speed": 25,
        "title": "grimer",
        "weight_pokemon": 300
      },
      {
        "attack": 55,
        "defense": 95,
        "height_pokemon": 6,
        "hp": 65,
        "special_attack": 65,
        "speed": 35,
        "title": "corsola",
        "weight_pokemon": 50
      },
      {
        "attack": 83,
        "defense": 57,
        "height_pokemon": 11,
        "hp": 65,
        "special_attack": 95,
        "speed": 105,
        "title": "electabuzz",
        "weight_pokemon": 300
      }
    ]
  }
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  if (request.body.result) {
    processV1Request(request, response);
  } else {
    console.log('Invalid Request');
    return response.status(400).end('Invalid Webhook Request (expecting v1 or v2 webhook request)');
  }
});

function getPokemon() {
  const query = `
    {
      pokemons {
        title
        speed
        hp
        defense
        special_defense
        attack
        special_attack
        pokemon_height
        pokemon_weight
      }
    }
  `
  return pkmnData ? new Promise(resolve => resolve(pkmnData)) : graphqlFetch(query)
}

/*
* Function to handle v1 webhook requests from Dialogflow
*/
function processV1Request(request, response) {
  let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
  let parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
  // let inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts
  let requestSource = (request.body.originalRequest) ? request.body.originalRequest.source : undefined;
  // let pokemons = [];
  const googleAssistantRequest = 'google'; // Constant to identify Google Assistant requests
  const app = new DialogflowApp({ request: request, response: response });
  // Create handlers for Dialogflow actions as well as a 'default' handler
  const actionHandlers = {
    // The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent)
    'input.welcome': () => {
      // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
      if (requestSource === googleAssistantRequest) {
        sendGoogleResponse('Hello, Welcome to my Dialogflow agent!'); // Send simple response to user
      } else {
        sendResponse('Hello, Welcome to my Dialogflow agent!'); // Send simple response to user
      }
    },
    // The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents)
    'input.unknown': () => {
      // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
      if (requestSource === googleAssistantRequest) {
        sendGoogleResponse('I\'m having trouble, can you try that again?'); // Send simple response to user
      } else {
        sendResponse('I\'m having trouble, can you try that again?'); // Send simple response to user
      }
    },

    'input.pokemon_compare': () => {
      let res
      const compareMons = parameters['pokemon-name'] // array of pokemons

      const paramStat = ((stat, keyword) => {
        const map = { faster: 'speed', stronger: 'attack', tougher: 'defense', taller: 'height', heavier: 'weight' }
        return stat ? stat.toLowerCase() : map[keyword] ? map[keyword] : null
      })(parameters.stat, parameters['comparison-keyword'])

      const stat = ((stat) => {
        const map = { height: 'height_pokemon', weight: 'weight_pokemon' }
        stat = stat.toLowerCase().replace(/ /g, '_')
        return map[stat] ? map[stat] : stat
      })(paramStat)

      return getPokemon().then(pkmnData => {
        let compare = compareMons.map(mon => {
          const pkmn = pkmnData.data.pokemons.filter(pkmn => pkmn.title === mon.toLowerCase().trim())[0]
          if (pkmn) {
            return [mon, pkmn[stat]]
          } else {
            res = `Whoa! Are you sure these are all Pokemon ${compareMons.join(', ')}?`
            requestSource === googleAssistantRequest ? sendGoogleResponse(res) : sendResponse(res)
            throw new Error('Undefined Pokemon')
          }
        })

        compare = compare.filter(n => n != undefined)

        if (compare.length === 0) {
          res = `Whoa! Are you sure these are all Pokemon ${compareMons.join(', ')}?`
          return requestSource === googleAssistantRequest ? sendGoogleResponse(res) : sendResponse(res)
        }

        compare.sort((a, b) => b[1] - a[1])

        res = compare.map((pkmn, i) => {
          return i === 0 ? `${pkmn[0]} has better ${paramStat} (${pkmn[1]}) than` : `${i > 1 ? 'or' : ''} ${pkmn[0]} (${pkmn[1]})`
        }).join(' ')
        return requestSource === googleAssistantRequest ? sendGoogleResponse(res) : sendResponse(res)
      }).catch(() => { // err
        res = 'I\'m not actually sure what happened here...'
        requestSource === googleAssistantRequest ? sendGoogleResponse(res) : sendResponse(res)
      })

    },

    'input.pokemon_stats': () => {
      let pokemon = parameters['pokemon-name']
      let res
      let mon = null

      const stat = ((stat) => {
        const map = { height: 'height_pokemon', weight: 'weight_pokemon' }
        stat = stat.toLowerCase().replace(/ /g, '_')
        return map[stat] ? map[stat] : stat
      })(parameters.stat)

      return getPokemon().then(results => {
        mon = results.data.pokemons.filter(value => value.title === pokemon.toLowerCase().trim())
        if (mon.length === 0) {
          res = `Sorry, I can't seem to find any information for ${pokemon}`
          return requestSource === googleAssistantRequest ? sendGoogleResponse(res) : sendResponse(res)
        }
        res = `${pokemon} ${parameters.stat} is ${mon[0][stat]}`
        return requestSource === googleAssistantRequest ? sendGoogleResponse(res) : sendResponse(res)
      })
    },
    // Default handler for unknown or undefined actions
    'default': () => {
      // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
      if (requestSource === googleAssistantRequest) {
        let responseToUser = {
          //googleRichResponse: googleRichResponse, // Optional, uncomment to enable
          //googleOutputContexts: ['weather', 2, { ['city']: 'rome' }], // Optional, uncomment to enable
          speech: 'This message is from Dialogflow\'s Cloud Functions for Firebase editor!', // spoken response
          text: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)' // displayed response
        };
        sendGoogleResponse(responseToUser);
      } else {
        let responseToUser = {
          //data: richResponsesV1, // Optional, uncomment to enable
          //outputContexts: [{'name': 'weather', 'lifespan': 2, 'parameters': {'city': 'Rome'}}], // Optional, uncomment to enable
          speech: 'This message is from Dialogflow\'s Cloud Functions for Firebase editor!', // spoken response
          text: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)' // displayed response
        };
        sendResponse(responseToUser);
      }
    }
  };

  console.log(action, 'The action to call');

  // If undefined or unknown action use the default handler
  if (!actionHandlers[action]) {
    action = 'default';
  }


  // Run the proper handler function to handle the request from Dialogflow
  actionHandlers[action]();
  // Function to send correctly formatted Google Assistant responses to Dialogflow which are then sent to the user
  function sendGoogleResponse(responseToUser) {
    if (typeof responseToUser === 'string') {
      app.ask(responseToUser); // Google Assistant response
    } else {
      // If speech or displayText is defined use it to respond
      let googleResponse = app.buildRichResponse().addSimpleResponse({
        speech: responseToUser.speech || responseToUser.displayText,
        displayText: responseToUser.displayText || responseToUser.speech
      });
      // Optional: Overwrite previous response with rich response
      if (responseToUser.googleRichResponse) {
        googleResponse = responseToUser.googleRichResponse;
      }
      // Optional: add contexts (https://dialogflow.com/docs/contexts)
      if (responseToUser.googleOutputContexts) {
        app.setContext(...responseToUser.googleOutputContexts);
      }
      console.log('Response to Dialogflow (AoG): ' + JSON.stringify(googleResponse));
      app.ask(googleResponse); // Send response to Dialogflow and Google Assistant
    }
  }
  // Function to send correctly formatted responses to Dialogflow which are then sent to the user
  function sendResponse(responseToUser) {
    // if the response is a string send it as a response to the user
    if (typeof responseToUser === 'string') {
      let responseJson = {};
      responseJson.speech = responseToUser; // spoken response
      responseJson.displayText = responseToUser; // displayed response
      response.json(responseJson); // Send response to Dialogflow
    } else {
      // If the response to the user includes rich responses or contexts send them to Dialogflow
      let responseJson = {};
      // If speech or displayText is defined, use it to respond (if one isn't defined use the other's value)
      responseJson.speech = responseToUser.speech || responseToUser.displayText;
      responseJson.displayText = responseToUser.displayText || responseToUser.speech;
      // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
      responseJson.data = responseToUser.data;
      // Optional: add contexts (https://dialogflow.com/docs/contexts)
      responseJson.contextOut = responseToUser.outputContexts;
      console.log('Response to Dialogflow: ' + JSON.stringify(responseJson));
      response.json(responseJson); // Send response to Dialogflow
    }
  }
}
