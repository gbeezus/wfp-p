<?php
/**
 * If on WPEngine
 *
 * @package WPEngine
 */

// Check for WPEngine environment.
if ( defined( 'WPE_ISP' ) && defined( 'PWP_NAME' ) ) {
	// FS writes aren't permitted with Composer, so we should let WordPress know to disable relevant UI.
	defined( 'DISALLOW_FILE_EDIT' ) || define( 'DISALLOW_FILE_EDIT', true );
	defined( 'DISALLOW_FILE_MODS' ) || define( 'DISALLOW_FILE_MODS', true );

	if ( ! empty( constant( 'PWP_NAME' ) ) ) {
		// Define Development/Staging/Production constants with site names.
		// These should be updated to reflect the sites names as defined in the WPEngine portal for the site.
		$wpe_prod_env  = '<Production-Key-ID';
		$wpe_stage_env = '<Staging-Key_ID>';
		$wpe_dev_env = '<Development-Key-ID>';

		switch ( true ) {
			case ( constant( 'PWP_NAME' ) === $wpe_prod_env ):
				defined( 'WP_ENVIRONMENT_TYPE' ) || define( 'WP_ENVIRONMENT_TYPE', 'production' );
				break;
			case ( constant( 'PWP_NAME' ) === $wpe_stage_env ):
				defined( 'WP_ENVIRONMENT_TYPE' ) || define( 'WP_ENVIRONMENT_TYPE', 'staging' );
				break;
			case ( constant( 'PWP_NAME' ) === $wpe_dev_env ):
			default:
				defined( 'WP_ENVIRONMENT_TYPE' ) || define( 'WP_ENVIRONMENT_TYPE', 'development' );
		}
	}
}
