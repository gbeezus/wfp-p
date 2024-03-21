<?php
/**
 * If on Pantheon.
 *
 * @package Pantheon
 */

if ( isset( $_ENV['PANTHEON_ENVIRONMENT'] ) ) {

	/**
	 * Set Pantheon environment.
	 *
	 * phpcs:disable WordPress.NamingConventions.ValidVariableName.VariableNotSnakeCase
	 */
	$envType = $_ENV['PANTHEON_ENVIRONMENT'];
	// phpcs:enable

	/**
	 * Disable wp-cron.php from running on every page load and rely on Pantheon to run cron via wp-cli
	 *
	 * @link https://github.com/pantheon-systems/WordPress/blob/default/wp-config-pantheon.php#L99-L103
	 */
	$network = isset( $_ENV['FRAMEWORK'] ) && 'wordpress_network' === $_ENV['FRAMEWORK'];
	if ( ! defined( 'DISABLE_WP_CRON' ) && false === $network ) {
		define( 'DISABLE_WP_CRON', true );
	}

	/**
	 * Prevent ftp_fget error on Pantheon
	 *
	 * @link https://wordpress.org/support/topic/ftp_nlist-warnings/#post-12155716
	 */
	if ( ! defined( 'FS_METHOD' ) ) {
		define( 'FS_METHOD', 'direct' );
	}

	/**
	 * Set root path
	 */
	$root_path = realpath( __DIR__ . '/..' );

	/**
	 * Wordfence Configuration.
	 */
	define( 'WFWAF_ENABLED', false );
	define( 'WORDFENCE_DISABLE_LIVE_TRAFFIC', true );
	define( 'WFWAF_STORAGE_ENGINE', 'mysqli' );
	define( 'WFWAF_LOG_PATH', $root_path . '/web/wp-content/uploads/wflogs/' );

	/**
	 * Force SSL
	 */
	define( 'FORCE_SSL_ADMIN', true );

	/**
	 * Limit post revisions
	 */
	define( 'WP_POST_REVISIONS', 3 );

	// ** MySQL settings - included in the Pantheon Environment ** //
	/** The name of the database for WordPress */
	define( 'DB_NAME', $_ENV['DB_NAME'] );

	/** MySQL database username */
	define( 'DB_USER', $_ENV['DB_USER'] );

	/** MySQL database password */
	define( 'DB_PASSWORD', $_ENV['DB_PASSWORD'] );

	/** MySQL hostname; on Pantheon this includes a specific port number. */
	define( 'DB_HOST', $_ENV['DB_HOST'] . ':' . $_ENV['DB_PORT'] );

	/** Database Charset to use in creating database tables. */
	define( 'DB_CHARSET', 'utf8' );

	/** The Database Collate type. Don't change this if in doubt. */
	define( 'DB_COLLATE', '' );

	defined( 'WP_DEBUG_LOG' ) || define( 'WP_DEBUG_LOG', __DIR__ . '/wp-content/uploads/debug.log' ); // Moves the log file to a location writable while in git mode. Only works in WP 5.1.

	/**#@+
	   * Authentication Unique Keys and Salts.
	   *
	   * Change these to different unique phrases!
	   * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
	   * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
	   *
	   * Pantheon sets these values for you also. If you want to shuffle them you
	   * can do so via your dashboard.
	   *
	   * @since 2.6.0
	   */
	define( 'AUTH_KEY', $_ENV['AUTH_KEY'] );
	define( 'SECURE_AUTH_KEY', $_ENV['SECURE_AUTH_KEY'] );
	define( 'LOGGED_IN_KEY', $_ENV['LOGGED_IN_KEY'] );
	define( 'NONCE_KEY', $_ENV['NONCE_KEY'] );
	define( 'AUTH_SALT', $_ENV['AUTH_SALT'] );
	define( 'SECURE_AUTH_SALT', $_ENV['SECURE_AUTH_SALT'] );
	define( 'LOGGED_IN_SALT', $_ENV['LOGGED_IN_SALT'] );
	define( 'NONCE_SALT', $_ENV['NONCE_SALT'] );
	/**#@-*/

	/** A couple extra tweaks to help things run well on Pantheon. */
	if ( isset( $_SERVER['HTTP_HOST'] ) ) {
		// HTTP is still the default scheme for now.
		$scheme = 'https';
		// If we have detected that the end use is HTTPS, make sure we pass that
		// through here, so <img> tags and the like don't generate mixed-mode
		// content warnings.
		if ( isset( $_SERVER['HTTP_USER_AGENT_HTTPS'] ) && 'ON' === $_SERVER['HTTP_USER_AGENT_HTTPS'] ) {
			$scheme = 'https';
		}

		// phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		// phpcs:disable WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		define( 'WP_HOME', $scheme . '://' . $_SERVER['HTTP_HOST'] );
		define( 'WP_SITEURL', $scheme . '://' . $_SERVER['HTTP_HOST'] . '/wp' );
		// phpcs:enable
	}

	/**
	 * Pantheon redirects
	 */
	if ( isset( $_SERVER['PANTHEON_ENVIRONMENT'] ) && php_sapi_name() !== 'cli' ) {
		// phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		// phpcs:disable WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		// Redirect to HTTPS on every Pantheon environment.
		$primary_domain = $_SERVER['HTTP_HOST'];

		if ( $_SERVER['HTTP_HOST'] !== $primary_domain || ! isset( $_SERVER['HTTP_X_SSL'] ) || 'ON' !== $_SERVER['HTTP_X_SSL'] ) {
			// Name transaction "redirect" in New Relic for improved reporting (optional).
			if ( extension_loaded( 'newrelic' ) ) {
				newrelic_name_transaction( 'redirect' );
			}

			$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? $_SERVER['REQUEST_URI'] : '';
			header( 'HTTP/1.0 301 Moved Permanently' );
			header( 'Location: https://' . $primary_domain . $request_uri );
			exit();
		}
		// phpcs:enable
	}

	// Don't show deprecations; useful under PHP 5.5.
	error_reporting( E_ALL ^ E_DEPRECATED );

	/**
	 * Define appropriate location for default tmp directory on Pantheon.
	 *
	 * @link https://github.com/pantheon-systems/WordPress/blob/default/wp-config-pantheon.php#L68-L69
	 */
	define( 'WP_TEMP_DIR', sys_get_temp_dir() );

	// FS writes aren't permitted on Pantheon and with Composer, so we should let WordPress know to disable relevant UI.
	define( 'DISALLOW_FILE_EDIT', true );
	define( 'DISALLOW_FILE_MODS', true );

}
