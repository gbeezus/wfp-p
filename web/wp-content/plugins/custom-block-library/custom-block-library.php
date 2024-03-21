<?php
/**
 * Plugin Name:       Custom Block Library
 * Description:       A collection of custom blocks
 * Requires at least: 5.9
 * Author:            Forum One
 * Text Domain:       custom-block-library
 *
 * @package           custom-block-library
 */

/**
 * Register custom block slugs here.
 *
 * @return void
 */
function custom_block_library_register_blocks() {
	register_block_type_from_metadata(__DIR__ . '/post-selector');
	// Add blocks to register here.
}
add_action( 'init', 'custom_block_library_register_blocks' );

/**
 * Add custom resolver for post-selector.
 */
function custom_block_library_post_selector_resolver() {
	register_graphql_field('CustomBlockLibraryPostSelector', 'post', array(
		'type' => 'Post',
		'description' => __( 'Selected post', 'custom-block-library' ),
		'resolve' => function( $root, $args, $context, $info ) {
			// Get the selected post ID from the block attributes.
			$post_id = $root['attrs']['selectedPostId'];
			// Return null if post ID was not found or is not valid.
			if ( empty( $post_id ) || $post_id <= 0 ) {
				return null;
			}
			$gql_post = $context->get_loader( 'post' )->load_deferred( $post_id );
			return $gql_post;
		},
	));
}
add_action( 'graphql_register_types', 'custom_block_library_post_selector_resolver' );

/**
 * Check if ACF registration function exists.
 *
 * @return void
 */
if ( function_exists( 'acf_register_block_type' ) ) {

	/**
	 * Register custom ACF block slugs here.
	 *
	 * @return void
	 */
	function custom_block_library_register_acf_blocks() {
		// Add any ACF blocks here.
	}
	add_action( 'acf/init', 'custom_block_library_register_acf_blocks' );
}

