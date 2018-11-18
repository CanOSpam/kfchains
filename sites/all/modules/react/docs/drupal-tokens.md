# Drupal & OAuth tokens

The `simple_oauth` module provides the OAuth server for Drupal. This module is responsible for generating and evaluating tokens. It leverages the Drupal role system to provide scopes for tokens and the scope restricts what a particular token has access to within Drupal.

- Default token scopes are configured with the client - these scopes will be delivered whenever a token is created and there is no way to revoke these default scopes

## What is an OAuth token

An OAuth token allows an application to verify and authenticate a user with a particular system without exposing the users password. A user typically authenticates with a known provider and the provider delivers a token to the application. The application can then interact with the token provider using the token to access information that the user has allowed.

## How does Drupal use tokens?

Drupal uses tokens to represent an authenticated user. Each token is assigned a set of roles based on requested scopes and when Drupal evaluates access privelleges it checks the roles assigned to the token rather than the roles assigned to the user who generated the token.

## More info

- https://oauth2.thephpleague.com/
- https://www.drupal.org/project/simple_oauth
- https://lightning.acquia.com/blog/using-content-api