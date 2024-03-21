#!/bin/bash

# Match the branch being built with the corresponding environment.
# This will pull any new configs after pushing artifacts to the
# WPEngine remote repository.
case "$BUILDKITE_BRANCH" in
  integration)
    ENVIRONMENT=[WPENGINE-SITE-KEY]@[WPENGINE-SITE-KEY].ssh.wpengine.net
    ;;

  main)
    ENVIRONMENT=[WPENGINE-SITE-KEY]@[WPENGINE-SITE-KEY].ssh.wpengine.net
    ;;

  live)
    ENVIRONMENT=[WPENGINE-SITE-KEY]@[WPENGINE-SITE-KEY].ssh.wpengine.net
    ;;
esac

[ ! -z "$ENVIRONMENT" ] && ssh -tt $ENVIRONMENT -o StrictHostKeyChecking=no <<-EOF
echo "Successfully connected to WPEngine SSH Gateway..."
echo "Ensuring WP-CFM Plugin is Activated..."
wp plugin activate wp-cfm
echo "Pulling Environment WP-CFM Bundles..."
wp config pull all
echo "Clearing WordPress Cache..."
wp cache flush
echo "Disconnecting from WPEngine SSH Gateway..."
exit
EOF
