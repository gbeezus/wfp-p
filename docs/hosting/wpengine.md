# WPEngine hosted project,

* Rename `.buildkite/pipeline.wpengine.yml` to `.buildkite/pipeline.deploy.yml`.
  * Modify the following variables:
    * `.buildkite/pipeline.deploy.yml` > `[WPENGINE-SITE-KEY]` for each environment. _(See comments in pipeline configuration.)_
    * `.buildkite/post-deply.sh` > `[WPENGINE-SITE-KEY]` for each environment. (**Note:** Each environment has it's own Git repository.)
* Update the `.buildkite/pipeline.yml` file, changing the `DOCKERFILE_STAGE_TARGET` environment variable, to target the `wpengine` Dockerfile stage instead of `artifact` for both building the Test & Release image builds.
* Delete the `.ddev/php/f1-php.ini` file.
* Delete the `.ddev/php/pantheon-php.ini` file.
* Delete the `.ddev/providers/f1.yaml` file.
* Delete the `.ddev/providers/pantheon.yaml` file.
* Delete `pantheon.yml` _(**Note**: this must be deleted otherwise univeral hosting setup will incorrectly identify this project as a Pantheon project.)_
* Delete the `.buildkite/pipeline.f1.yml` file.
* Delete the `.buildkite/pipeline.pantheon.yml` file.
* Delete the `web/wp-config.pantheon.php` directory.
* Delete the `web/private` directory.
* Delete the `capistrano` directory.
* Delete the `Capfile` file
* Delete the `Gemfile` file
* Delete Pantheon specific WordPress Plugins from the `composer.json`:
  * `wpackagist-plugin/pantheon-advanced-page-cache`
  * `wpackagist-plugin/pantheon-hud`
  * `wpackagist-plugin/wp-native-php-sessions`

## PHP Version Configuration

WP Engine made the decision to skip PHP 8.1 on their hosting platform so all references for PHP 8.1 in this project need to be updated to reference PHP 8.2 to ensure compatibility with WP Enging hosting environments. (See the [PHP Upgrade Guide](https://forumone.atlassian.net/wiki/spaces/support/pages/2010939503/Upgrade+process+overview+planning+and+tools#Local-Development-%26-Build-Configuration-Changes) for additional details)

## PHP Memory Limit Configuration

Update the `.ddev/php/wpengine-php.ini` file to include the correct configuration for the local DDev environment that matches the hosting environment. (see: https://wpengine.com/support/platform-settings/#WordPress_Memory_Limit)

## WPEngine Server Hosting Setup

See the [WP Engine Hosting guide](https://forumone.atlassian.net/wiki/spaces/TECH/pages/2834923559/WP+Engine+Hosting) in Confluence for additional information.

In order for WPEngine environments to use the `wp-config.wpengine.php` configuration file, with the WP-CFM environment detection, the WPEngine managed `sites/[WPENGINE-SITE-ID]/wp-config.php` WordPress configuration file will need to be updated in each environment. You will need to include the following code after the `# WP Engine Settings` comment line:

```php
/**
 * WPEngine custom configuration.
 */
$f1_wpe_settings = __DIR__ . '/wp-config.wpengine.php';
if ( is_readable( $f1_wpe_settings ) ) {
        require_once( $f1_wpe_settings );
}
```

