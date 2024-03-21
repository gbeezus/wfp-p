<?php
/**
 * Plugin Name: Forum One Redis Customizations
 * Description: Custom functions, filters and action hooks for additional Redis support.
 * Author: Forum One
 * Author URI: https://forumone.com
 *
 * @package  ForumOne_MuPlugins
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Adds a button to flush the Redis object cache.
 *
 * @param WP_Admin_Bar $wp_admin_bar The WordPress admin bar object.
 *
 * @return void
 */
function f1_flush_cache_button( $wp_admin_bar ) {
	// Don't show the Flush Cache option if it's not enabled.
	if ( empty( $_ENV['CACHE_HOST'] ) ) {
		return;
	}

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$flush_cache_op = isset( $_GET['flush-cache-button'] ) ? sanitize_text_field( wp_unslash( $_GET['flush-cache-button'] ) ) : '';
	$wpnonce = isset( $_GET['_wpnonce'] ) ? sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ) : '';

	if ( 'flush' === $flush_cache_op && wp_verify_nonce( $wpnonce, 'flush-cache-button' ) ) {
		wp_cache_flush();
		add_action( 'admin_notices', 'f1_flush_cache_admin_notice__success' );
	}

	$dashboard_url = admin_url( add_query_arg( 'flush-cache-button', 'flush', 'index.php' ) );
	$args = array(
		'id'    => 'flush_cache_button',
		'title' => 'Flush Object Cache',
		'href'  => wp_nonce_url( $dashboard_url, 'flush-cache-button' ),
		'meta'  => array( 'class' => 'flush-cache-button' ),
	);

	$wp_admin_bar->add_node( $args );
}

/**
 * Display Cache Flush success admin notice.
 *
 * @return void
 */
function f1_flush_cache_admin_notice__success() {
	$classes = 'notice notice-success is-dismissible';
	$message = __( 'Object Cache flushed.', 'forum_one_mu_plugins' );
	printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $classes ), esc_html( $message ) );
}

if ( function_exists( 'wp_cache_flush' ) ) {
	add_action( 'admin_bar_menu', 'f1_flush_cache_button', 100 );
}

/**
 * Adds Redis Support Information to the WordPress Site Health Info.
 *
 * @link https://developer.wordpress.org/reference/hooks/debug_information/
 *
 * @param array<array<string, array<string, array<string, mixed>>|string>|string> $args The debug information to be added to the core information page. This is an associative multi-dimensional array, up to three levels deep. The topmost array holds the sections, keyed by section ID.
 *
 * @return array<array<string, array<string, array<string, mixed>>|string>|string>
 */
function f1_wp_redis_add_health_check_info( $args ) {
	/* @phpstan-ignore-next-line */
	$redis_info = wp_redis_get_info();
	$defaults = array(
		'redis_version'     => 'Unknown',
		'redis_mode'        => 'Unknown',
		'status'            => 'Unknown',
		'redis_host'        => 'Unknown',
		'redis_port'        => 'Unknown',
		'redis_database'    => 'Unknown',
		'uptime'            => 'Unknown',
		'used_memory'       => 'Unknown',
		'key_count'         => 'Unknown',
		'lifetime_hitrate'  => 'Unknown',
		'instantaneous_ops' => 'Unknown',
		'maxclients'        => 'Unknown',
		'connected_clients' => 'Unknown',
	);
	if ( gettype( $redis_info ) === 'array' ) {
		$redis_info = array_replace_recursive( $defaults, $redis_info );
	}

	$args['wp_redis'] = array(
		'label' => 'Redis Info',
		'fields' => array(
			'version' => array(
				'label' => 'Server version',
				'value' => $redis_info['redis_version'],
			),
			'mode' => array(
				'label' => 'Server mode',
				'value' => $redis_info['redis_mode'],
			),
			'status' => array(
				'label' => 'Status',
				'value' => $redis_info['status'] . ' to ' . $redis_info['redis_host'] . ':' . $redis_info['redis_port'],
			),
			'database' => array(
				'label' => 'Database',
				'value' => $redis_info['redis_database'],
			),
			'uptime' => array(
				'label' => 'Uptime',
				'value' => $redis_info['uptime'],
			),
			'used_memory' => array(
				'label' => 'Used memory',
				'value' => $redis_info['used_memory'],
			),
			'key_count' => array(
				'label' => 'Keys',
				'value' => $redis_info['key_count'],
			),
			'hit_rate' => array(
				'label' => 'Hit Ratio',
				'value' => $redis_info['lifetime_hitrate'],
			),
			'inst_ops' => array(
				'label' => 'Ops/Second',
				'value' => $redis_info['instantaneous_ops'],
			),
			'max_clients' => array(
				'label' => 'Max clients',
				'value' => $redis_info['maxclients'],
			),
			'connected_clients' => array(
				'label' => 'Connected clients',
				'value' => $redis_info['connected_clients'],
			),
		),
	);

	return $args;
}
if ( ! empty( $_ENV['CACHE_HOST'] ) ) {
	add_filter( 'debug_information', 'f1_wp_redis_add_health_check_info' );
}
