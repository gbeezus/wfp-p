<?php
/**
 * Contains script to run `wp config pull`.
 *
 * @package ForumOne_Workflow
 */

print( "\n==== WP-CFM Config Import Starting ====\n" );

// Activate the wp-cfm plugin.
exec( 'wp plugin activate wp-cfm 2>&1' );

// Pull all tracked configs from WP-CFM bundles.
exec( 'wp config pull all 2>&1' );

// Flush the WP cache.
print( "\n==== Clearing WP cache... ====\n" );
exec( 'wp cache flush' );
print( "\n==== WP cache cleared. ====\n" );

// Flush the Edge cache.
print( "\n==== Purging edge cache... ====\n" );
pantheon_clear_edge_all();
print( "\n==== Edge cache cleared. ====\n" );


print( "\n==== WP-CFM Config Import Complete ====\n" );
