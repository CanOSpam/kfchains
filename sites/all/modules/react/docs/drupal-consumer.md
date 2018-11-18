## Headless Lightning Consumers

#### What is a consumer?

This is defined as a client who can consume the API based on the scope it is associated with. Clients allow API users to interact with content. Clients have relationships to one or more roles via scopes and inherit the permissions assigned to those roles. Create a client and provide access permissions to content types. OAuth2 scopes are implemented as Drupal roles. Create a role for every logical group of permissions you want to make available to a consumer.

#### How to add a consumer?

Go to `/admin/config/services/consumer/add` on the site, give it a name and select the scope, by choosing a [Drupal role](../drupal-roles.md) for this consumer.

When creating a consumer you can optionally assign a user to the consumer. This will be the user account that is used if during OAuth authentication no user credentials have been provided. For security purposes this user shouldn't have access to elevated system permissions as these can be added to the token via the `scope` parameter.

The OAuth scope is used as a default set of permissions that all tokens will have when they are created by this client. Additional scopes can be requested by using the `scope` parameter when requesting a token. These scopes are in addition to the default scopes and are intersected with the roles that the user account has in Drupal.

Anonymous access to the API is allowed in the same way that Drupal allows anonymous access to content. Generally, published content is available while unpublished content is not. If your application needs more privileged access (for example, accessing unpublished or creating new content) you will need to authenticate. 

Once you have a client and user set up, you can obtain an access token like this:

```
#Example CURL request for keys
curl -X POST -d "grant_type=password&client_id=api_test{CLIENT_ID}&client_secret={SECRET}&username={USERNAME}&password={PASSWORD}" https://{YOURDOMAIN}/oauth/token
```

