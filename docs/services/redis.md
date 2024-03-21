# Redis Support

## Project is Using Redis

1. Create a new file named `web/wp-content/object-cache.php` that contains the following:
```php
<?php
# This is a Windows-friendly symlink
if ( ! empty( $_ENV['CACHE_HOST'] ) ) {
  require_once WP_CONTENT_DIR . '/plugins/wp-redis/object-cache.php';
}
```
2. Configure the local `.env` file with the following:

```yaml
WP_CACHE=true
CACHE_HOST=redis
CACHE_PORT=6379
CACHE_DB=0
WP_CACHE_KEY_SALT=<salt-prefix>
WP_REDIS_USE_CACHE_GROUPS=true
```
3. Run `ddev get drud/ddev-redis`
4. Please open `.ddev/docker-compose.redis.yaml`

### Pantheon Support

[Pantheon Redis]:https://pantheon.io/docs/object-cache
Please make the changes referenced for [Pantheon Redis].

## Project is Not Using Redis

Then please delete the following:

* `"wpackagist-plugin/wp-redis": "*"` from the `composer.json`

