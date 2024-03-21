# [**DRAFT**] ElasticSearch Support

## Project is Using ElasticSearch

1. Please run: `ddev get drud/ddev-elasticsearch`
2. Follow [Configuring ElasticPress via the Plugin Dashboard](https://elasticpress.zendesk.com/hc/en-us/articles/360050447492-Configuring-ElasticPress-via-the-Plugin-Dashboard)

> @TODO: This documentation should be updated according to the requirements for a real setup. This has not yet been tested or deployed on a Forum One built site.
> ElasticPress does provide the following constants that can be set in the `.env` file: `EP_HOST`, `EP_CREDENTIALS`, `EP_API_KEY`, `EP_INDEX_PREFIX`, `EP_IS_NETWORK`, `EP_SYNC_CHUNK_LIMIT`, `WP_EP_DEBUG`, `EP_AUTOSUGGEST_ENDPOINT`

## Project is Not Using ElasticSearch

Delete the following files:

* `"wpackagist-plugin/elasticepress": "*"` from the `composer.json`

