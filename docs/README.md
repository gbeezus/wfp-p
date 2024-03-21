# WordPress Project Template [![Build status](https://badge.buildkite.com/7b5b3e8a2c910caf5719b1fffcf90106932fe1204afead2509.svg)](https://buildkite.com/forum-one/wordpress-starter-project)

This is a build guide to help walk you through setting up a new WordPress project.

*Note: Additional documentation and references can be found in the [Tech Team Confluence space](https://forumone.atlassian.net/wiki/spaces/TECH/pages/3000533226/Creating+a+new+WordPress+Project).*

## Requirements

- [Tiged](https://www.npmjs.com/package/tiged) - `npm install -g tiged`
- [DDev](https://forumone.atlassian.net/wiki/spaces/TECH/pages/2859270145/Installing+DDev)
- [Docker & Docker Compose/Docker Desktop](https://forumone.atlassian.net/wiki/spaces/TECH/pages/2859270145/Installing+DDev#Requirements%3A)

## Getting started...

1. Clone this repository using Tiged/Degit.
```shell
degit --mode=git git@github.com:forumone/wordpress-project.git [project-name]
```
_Note: If you have an issue with that command try without the `--mode=git` option_

2. Initialize the new project as a Git repository.
```shell
cd [project-name]
git init
```
3. Add the git remote for the new repository.
```shell
git remote add origin git@github.com:forumone/[project-name].git
```
4. Run `ddev config`.

- Project name (`[project-name]`): `[project-name]<ENTER>`
- Docroot Location (...): `web<ENTER>`
- Project Type [...]: `wordpress<ENTER>`

5. Update the DDev `.ddev/config.yml` file.

- Set PHP version to `"8.1"`, if not already set.
  - `php_version: "8.1"`
- Set Node version to `"18"`, if not already set.
  - `nodejs_version: "18"`
- Set Composer version to `"2.6"`, at a minimum.
  - `composer_version: "2.6"`

6. Ensure that the `wp-config.php` file is updated with the DDev project name(`PROJECT_ID`).

```php
$home .= $_SERVER['SERVER_NAME'] ?? '<PROJECT_ID>.ddev.site';
```

7. If the production vanity domain name is known then update that in the `web/robots.txt` file.


## Project Specific Setup

Please follow the required guides:

- Hosting
  - [Pantheon](hosting/pantheon.md)
  - [Forum One](hosting/f1.md) ( _Note: Use this setup if setting up a local-only WordPress testing instance._ )
  - [WPEngine](hosting/wpengine.md)
- Services
  - [Theme Support](services/theme.md) ( _Note: You must choose a theme setup for all projects._ )
  - [Redis Support](services/redis.md)
  - [ElasticSearch Support](services/elasticsearch.md)
- [Optional Support](services/optional.md)

## Project README

Rename the `README.project.md` file to `README.md`. Update the `README.md` with the correct details for your projects. Take note of the Project Name at the top as well as the Buildkite badge setup. _(**Note**: The Buildkite build status badge can be found in the Buildkite pipeline settings online.)_

