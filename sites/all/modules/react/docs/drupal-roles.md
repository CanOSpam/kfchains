## Drupal User Roles

### About Drupal Roles 

One of the core methods to administer content permissions in Drupal is by the grouping of roles. Rather than assigning individual permissions to each user, permissions are assigned to roles, and roles are assigned to users. Using roles gives administrators greater control over permissions, making it easy to assign and remove roles when necessary. 

### Roles & Permissions assigned to this project

The database included in this website has already set up the proper roles and permissions to interact with the API based on content type. You can view the existing list at [http://local.decoupledkit.com/admin/access/roles](http://local.decoupledkit.com/admin/access/roles) and can extend upon these roles while testing.

Available roles and scopes in this Decoupled Starter Kit:

```
Basic page creator
Basic page reviewer
Client creator
Client reviewer
Dogs creator
Dogs reviewer
Marvel Characters creator
Marvel Characters reviewer
Media creator
Media manager
Pokemon creator
Pokemon reviewer
```

### Roles & decoupled

When working with Drupal in a decoupled architecture, roles provide the OAuth server with available scopes. When permissions are evaluated they do not take the roles that the user has been given into consideration; rather the roles that have been provisioned with token. Token roles are provisioned when additional scopes are requested at generation time. For a token to be given additional roles the user account that is generating the token needs to have the role assigned as well, this prevents unwanted permissions elevation.
