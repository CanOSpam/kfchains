## Headless Lightning API Settings

The Headless Lightning distribution offers various configuration options in the UI when interacting with external applications. After setting up your local instance, these settings are located at [http://local.decoupledkit.com/admin/access/settings](http://local.decoupledkit.com/admin/access/settings).


**Access token expiration time** - the default value in seconds to be used as expiration time when creating new tokens for interaction with the API. This is currently set to `545400` for demonstration purposes, but we recommend a standard integer for production sites.

**Refresh token expiration time** - the default value, in seconds, to be used as expiration time when creating new tokens. This is currently set to `1209600` but should be updated as well for production scenarios.

**Public Key** - the assigned path to the public key file which should match the key generated in the `keys/` folder. This is included by default but can be generated properly by following the [Simple OAuth](https://www.drupal.org/project/simple_oauth instruction/) instructions or example below.

**Private Key** - the assigned path to the private key file which should match the key generated in the `keys/` folder. This is included by default but can be generated properly by following the [Simple OAuth](https://www.drupal.org/project/simple_oauth instruction/) instructions or example below.


```
#Example CURL request for keys
curl -X POST -d "grant_type=password&client_id=api_test{CLIENT_ID}&client_secret={SECRET}&username={USERNAME}&password={PASSWORD}" https://{YOURDOMAIN}/oauth/token
```


