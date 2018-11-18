import {
  drupalAPI
} from '../api/drupalAPI';
import envVars from '../../tools/envVars';

export const DRUPAL_API_LOC = envVars.drupal_url + '/jsonapi/node/dogs';
export const LOAD_DRUPAL_DATA = 'LOAD_DRUPAL_DATA';
export const RECEIVE_DRUPAL_DATA = 'RECEIVE_DRUPAL_DATA';
export const LOAD_DRUPAL_IMAGES = 'LOAD_DRUPAL_IMAGES';
export const RECEIVE_DRUPAL_IMAGES = 'RECEIVE_DRUPAL_IMAGES';
export const DRUPAL_CRUD_MESSAGE_SEND = 'DRUPAL_CRUD_MESSAGE_SEND';
export const DRUPAL_CRUD_MESSAGE_CLEAR = 'DRUPAL_CRUD_MESSAGE_CLEAR';
export const RECEIVE_DRUPAL_SINGLE_CACHE = 'RECEIVE_DRUPAL_SINGLE_CACHE'
export const RECEIVE_DRUPAL_SINGLE_LOCAL_STORAGE = 'RECEIVE_DRUPAL_SINGLE_LOCAL_STORAGE'
export const RECEIVE_DRUPAL_SINGLE_INDEXEDDB = 'RECEIVE_DRUPAL_SINGLE_INDEXEDDB'
export const timeout_seconds = 1000; // 3000


export function loadDrupalData() {
  return {
    type: LOAD_DRUPAL_DATA,
    data: {}
  };
}

export function receiveDrupalData(data) {
  return {
    type: RECEIVE_DRUPAL_DATA,
    data
  };
}

export function receiveDrupalImages(images) {
  return {
    type: RECEIVE_DRUPAL_IMAGES,
    images
  };
}

export function sendMessage(message) {
  return {
    type: DRUPAL_CRUD_MESSAGE_SEND,
    message
  };
}

export function clearMessage() {
  return {
    type: DRUPAL_CRUD_MESSAGE_CLEAR,
    message: null
  }
}

export function updateContent(uuid, attr) {
  const fields = JSON.parse(JSON.stringify(attr));
  
  return dispatch => {
    const body = {
      "data": {
        "id": uuid,
        "type": "node--dogs",
        "attributes": {
          'title': fields['title'],
          'body': fields['body'],
          'field_history_and_background': fields['field_history_and_background'],
        }
      }
    }

    if (attr.uploadedFiles) {
      const {
        image,
        name
      } = attr.uploadedFiles
      dispatch(sendMessage(`Uploading files for ${uuid}`))
      drupalAPI.uploadImages('/file/image', image, name)
        .then(file => {
          if (file.errors) {
            dispatch(sendMessage(file.errors[0].detail))
            setTimeout(() => {
              dispatch(clearMessage())
            }, timeout_seconds)
            return
          }

          const {
            data: {
              type,
              attributes
            }
          } = file;
          dispatch(sendMessage(`Files uploaded successfully, updating references.`))

          body.data.relationships = {
            field_dog_picture: {
              data: {
                type: type,
                id: attributes.uuid
              }
            }
          }

          drupalAPI.updateDrupal(`/node/dogs/${uuid}`, body).then(() => {
            dispatch(doLoadDrupalData())
            dispatch(sendMessage(`Successfull updated ${uuid}`))
            setTimeout(() => {
              dispatch(clearMessage())
            }, timeout_seconds)
          })
        })
    } else {
      dispatch(sendMessage(`Sending a content update for ${uuid}`));
      drupalAPI.updateDrupal(`/node/dogs/${uuid}`, body).then(() => {
        dispatch(doLoadDrupalData());
        dispatch(sendMessage(`Succesfully updated ${uuid}`));
        setTimeout(() => {
          dispatch(clearMessage())
        }, timeout_seconds);
      });
    }
  }
}

export function createContent(item) {
  return dispatch => {
    const {
      title,
      body,
      field_history_and_background,
      uploadedFile
    } = item;
    const requestBody = {
      "data": {
        "type": "node--dogs",
        "attributes": {
          title,
          body: {
            value: body,
            format: 'rich_text'
          },
          field_history_and_background: {
            value: field_history_and_background,
            format: 'rich_text'
          }
        }
      }
    }

    dispatch(sendMessage(`Creating a new node with title ${title}`));

    if (uploadedFile) {
      const {
        image,
        name
      } = uploadedFile
      drupalAPI.uploadImages('/file/image', image, name)
        .then(file => {
          if (file.errors) {
            dispatch(sendMessage(file.errors[0].detail))
            setTimeout(() => {
              dispatch(clearMessage())
            }, timeout_seconds)
            return
          }

          const {
            data: {
              type,
              attributes
            }
          } = file;
          dispatch(sendMessage(`Files uploaded successfully, updating references.`))

          requestBody.data.relationships = {
            field_dog_picture: {
              data: {
                type: type,
                id: attributes.uuid
              }
            }
          }

          drupalAPI.createNode('/node/dogs', requestBody)
            .then(() => {
              dispatch(doLoadDrupalData());
              dispatch(sendMessage(`Successfully created the node!`));
              setTimeout(() => {
                dispatch(clearMessage())
              }, timeout_seconds);
            });
        })
    } else {
      drupalAPI.createNode('/node/dogs', requestBody)
        .then(() => {
          dispatch(doLoadDrupalData());
          dispatch(sendMessage(`Successfully created the node!`));
          setTimeout(() => {
            dispatch(clearMessage())
          }, timeout_seconds);
        });
    }
  }
}

export function deleteContent(uuid) {
  return dispatch => {
    dispatch(sendMessage(`Deleting node with ${uuid}`));
    return drupalAPI.deleteNode(`/node/dogs/${uuid}`)
      .then(() => {
        dispatch(sendMessage(`Successfully deleted ${uuid}`));
        dispatch(doLoadDrupalData());
        setTimeout(() => {
          dispatch(clearMessage())
        }, timeout_seconds);
      });
  }
}

/**
 * Fetch the drupal data.
 *
 * This will initiate a state change via `dispatch` and will instruct the
 * component who is listening to the state of this action to trigger an update.
 * We will chain resolvers here as well, after the initial request for data has
 * completed we will trigger another request which we can `dispatch` back to
 * the component and trigger another state update to add images.
 */
export function doLoadDrupalData() {
  let result = {};
  return (dispatch) => {
    return drupalAPI.getAllDrupal('/node/dogs')
      .then(json => {
        const {
          data
        } = json;
        result = data.reduce((result, item) => {
          result[item.id] = item;
          return result;
        }, {});

        // let initialReturn = JSON.parse(JSON.stringify(result));

        // @STEVE: still having the images loading unless I comment this out, so lets sync up about this.
        // dispatch(receiveDrupalData(initialReturn));

        // initialReturn = null; // GC.

        const imageRequests = [];
        Object.keys(result).forEach((uuid) => {
          imageRequests.push(drupalAPI.getAllDrupalImg(`/node/dogs/${uuid}/field_dog_picture`));
        });

        Promise.all(imageRequests).then(values => {
          // If the request 500s we can get an undefined result so we ensure to filter
          // the values array before we process each item.
          values = values.filter(n => n != undefined)

          values.forEach((item) => {
            if (item.hasOwnProperty('data')) { // validate it's not returning "" from 500
              const {
                data: {
                  attributes
                },
                links: {
                  self
                }
              } = item;
              const uuid = self.split('/').splice(-2, 1)[0]; // has to be a better way to get the UUID.
              if (attributes && attributes.url) {
                result[uuid].image = DRUPAL_API_LOC.replace('/jsonapi/node/dogs', attributes.url);
              }
            }
          });
          let imageResult = JSON.parse(JSON.stringify(result));
          return imageResult;
        }).then(function (imageResult) {
          dispatch(receiveDrupalData(imageResult));
        }).catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
}
