#!/bin/bash

# Hit the web GraphQL endpoint until it responds with an expected error
# then startup the dev server

rem_trailing_slash() {
    echo "$1" | sed 's/\/*$//g'
}

WP_URL="$(rem_trailing_slash "${NEXT_PUBLIC_WORDPRESS_URL}")"

TEST_URL="${WP_URL}"/\?graphql

while :
do
	echo "Testing ${TEST_URL}"
	CONTENT="$(curl -s "${TEST_URL}")"
	if [[ "${CONTENT}" =~ "GraphQL Request" ]]; then
		# we're in business
		break
	else
		echo "Not ready. Waiting..."
		sleep 5
	fi
done

npm run dev
