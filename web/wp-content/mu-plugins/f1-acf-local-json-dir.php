<?php
/**
 * Plugin Name: Define ACF JSON Location
 * Description: Enforce ACF Settings to be stored in a custom location.
 *
 * @package  ForumOne_MuPlugins
 *
 * @link https://www.advancedcustomfields.com/resources/local-json/
 * @link https://www.advancedcustomfields.com/resources/acf-settings/
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Sets a custom location for acf-json folder out of the theme directory.
 *
 * @link https://www.advancedcustomfields.com/resources/local-json/
 * @link https://www.advancedcustomfields.com/resources/acf-settings/
 *
 * @param string|array<mixed> $path The plugin settings path.
 *
 * @return string|array<mixed>
 */
function f1_acf_local_json_dir( array|string $path ): array|string {
	// Set custom path in /wp-content/acf-json.
	$_path = WP_CONTENT_DIR . '/acf-json';

	if ( is_array( $path ) ) {
		// If $path is an array then this the load_json filter settings.
		unset( $path[0] );
		$path[] = $_path;

		return $path;
	}

	return $_path;
}
add_filter( 'acf/settings/save_json', 'f1_acf_local_json_dir' );
add_filter( 'acf/settings/load_json', 'f1_acf_local_json_dir' );
