## JSON API in Drupal

### Overview

Each resource served by the JSON API must have a globally unique type property. The Drupal JSON API implementation derives this type property from the entity type machine name and bundle machine name. For example, articles, pages, and users are given the types `node--article`, `node--pages`, and `user--user`, respectively. The user entity type in Drupal does not have a bundle. When an entity type does not have a bundle, the entity type is simply repeated for consistency.

### Path Types & Route Structure

A valid JSON API route would mirror the following samples and the URL always is prefixed by `/jsonapi`.

```
GET|POST            /jsonapi/node/marvel_characters
GET|PATCH|DELETE    /jsonapi/node/marvel_characters/{node}
```

Every resource type must be uniquely addressable in the API and every type, which is available to the API, must have a unique URL. In addition to requiring that each type be addressable, this always means that only one resource type can fetched a given URL. The Drupal implementation follows the pattern: `/jsonapi/{entity_type_id}/{bundle_id}[/{entity_id}]`.

The entity type id and the bundle id are concatenated by a forward slash. There is no URL at `/jsonapi/node`, this is because this URL would violate the specification by serving multiple resource types (ie. multiple bundle types) from a single URL.
    
```
Exists:
/jsonapi/node/page
/jsonapi/node/article

Does not exist:
/jsonapi/node
```
    
Following the entity type and bundle id, there is an optional ID parameter. For addressing single resource, either to fetch, update, or remove them, you must include the route to validate and it is always the UUID of the resource. When creating a new resource, with or without an ID, or fetching a collection of resources of a single type, one omits the ID route portion in the URL.

```
GET, POST
/jsonapi/node/marvel_characters
```

```
PATCH, DELETE
/jsonapi/node/marvel_characters/{uuid}
```

Example of structure of individual GET(`/jsonapi/node/marvel_characters/{node}`).

```
{
    "attributes": {
        "nid": 0,
        "uuid": "string",
        "vid": 0,
        "langcode": {
            "value": "string",
            "language": null
        },
        "revision_timestamp": 0,
        "revision_log": "",
        "status": true,
        "title": "string",
        "created": 0,
        "changed": 0,
        "promote": 0,
        "sticky": false,
        "default_langcode": true,
        "revision_translation_affected": true,
        "moderation_state": "string",
        "scheduled_publication": {
            "value": "2018-03-20"
        },
        "scheduled_moderation_state": "string",
        "path": {
            "alias": "string",
            "pid": 0,
            "langcode": "string"
        },
        "field_description": {
            "value": "string",
            "format": "string"
        },
        "field_image_reference": "string",
        "field_marvel_id": "string",
        "field_nemesis": [
            "string"
        ]
    },
    "relationships": {
        "type": {
            "data": {
                "type": "node_type--node_type",
                "id": "string"
            }
        },
        "revision_uid": {
            "data": {
                "type": "user--user",
                "id": "string"
            }
        },
        "uid": {
            "data": {
                "type": "user--user",
                "id": "string"
            }
        }
    },
    "type": "node--marvel_characters",
    "id": "string"
}
```

### HTTP Methods

JSON API specifies what HTTP Methods to accept, which is then mirrored in the Drupal services workflow.

`GET - Retrieve data, which can be a collection or resources or an individual resource`

`POST - Create a new resource`

`PATCH - Update an existing resource`

`DELETE - Remove an existing resource`

**note:** `PUT` is not included within the workflow 


### Additional References

- [JSON API - Drupal Module](https://www.drupal.org/docs/8/modules/json-api)
- [Using the Content API - Lightning](https://lightning.acquia.com/blog/using-content-api)

