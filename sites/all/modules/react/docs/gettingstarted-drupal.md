## Headless Lightning Drupal

### About

This [repository](https://github.com/acquia-pso/decoupledkit-drupal) contains a Decoupled Drupal instance using the [Headless Lightning](https://github.com/acquia/headless-lightning) sub-profile. This project is intended as a central data source for various decoupled applications to illustrate typical workflows. This repository is intended to supply content via an API to its sibling application. The sibling application is located at [https://github.com/acquia-pso/decoupledkit-react](https://github.com/acquia-pso/decoupledkit-react). This project is based on [BLT](http://blt.readthedocs.io/en/latest/readme/onboarding/) and [DrupalVM](https://www.drupalvm.com/) to help with quickly setting up locally.

### Installation Requirements

- [PHP](http://php.net/downloads.php) (7.1 or higher suggested)
- [Composer](https://getcomposer.org)
- [Vagrant](https://www.vagrantup.com/downloads.html)
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [Git](https://git-scm.com/downloads)

### Installation Steps

The the summarized steps are listed here, but you can view the full [BLT documentation](http://blt.readthedocs.io/en/latest/readme/onboarding/).

* Fork the [develop branch](https://github.com/acquia-pso/decoupledkit-drupal) and clone locally
* Navigate to the project root and install composer dependencies with `composer install`
* Install blt alias: `composer run-script blt-alias`
* Start your virtual machine: `blt vm`
* Build and install the Drupal installation: `blt setup`
* You should now see a local instance running at `http://local.decoupledkit.com`
* You can now login with `drush uli --uri=local.decoupledkit.com` *or* ssh into the vagrant box with `vagrant ssh` then navigate with `cd docroot/` and use `drush uli`
* The database and files directory can now be imported and added after downloading from [here](https://drive.google.com/drive/u/0/folders/1GCaCBYrC1LPVKyVUiTBfbmeDoVSPjvaG)

### Additional Installation Notes

* All configuration for Drupal is included with the [sample database](https://drive.google.com/drive/u/0/folders/1GCaCBYrC1LPVKyVUiTBfbmeDoVSPjvaG), but you can review or update the settings [http://local.decoupledkit.com/admin/access/users](http://local.decoupledkit.com/admin/access/users).
* The headers used in the React/GraphQL application are using the Drupal account `apitest` and you can review those permission settings [here](http://local.decoupledkit.com/admin/config/services/consumer).
* PHP 7.1 is recommended locally, so you may need to update the `php_version ` in `box/config.yml` and re-provision your Drupal VM.
* The sibling [React application](https://github.com/acquia-pso/decoupledkit-react) will utilize OAuth to validate headers with keys stored in the `keys/` directory. So make sure the public key permissions are updated to allow reading these files.

#### Technologies & Tools Documentation

- [BLT documentation](http://blt.readthedocs.io/en/latest/readme/onboarding/)
- [DrupalVM documentation](https://www.drupalvm.com/)
- [Headless Lightning repository](https://github.com/acquia/headless-lightning)
- [JSON API Drupal Module](https://www.drupal.org/project/jsonapi)