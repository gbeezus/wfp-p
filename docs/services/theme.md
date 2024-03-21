# Theme Support

## Project is Using Gesso 5 for the Theme

- Please add the latest v5.x [Gesso Starter Theme](https://github.com/forumone/gesso-wp) to the `web/wp-content/themes` folder using the latest [5.x Release](https://github.com/forumone/gesso-wp/releases) tag.
```shell
cd web/wp-content/themes
degit --mode=git --force git@github.com:forumone/gesso-wp.git#<LATEST-5.X-RELEASE-TAG> gesso
```

## Project is Using Gesso 4 for the Theme

- Please add the latest v4.x [Gesso Starter Theme](https://github.com/forumone/gesso-wp) to the `web/wp-content/themes` folder using the latest [4.x Release](https://github.com/forumone/gesso-wp/releases) tag.
```shell
cd web/wp-content/themes
degit --mode=git --force git@github.com:forumone/gesso-wp.git#<LATEST-4.X-RELEASE-TAG> gesso
```

- Update the Gesso version from `5` to `4` in the following files:
  - `.ddev/docker-compose.gesso.yml`
  - `Dockerfile`

### Add the Timber Composer Package

Gesso 4 requires uses Pattern Lab & Twig. It is required to add the Timber Composer package. (See [Timber v2 Installation Guide](https://timber.github.io/docs/v2/installation/))

## Project is Using a Different Theme

_Note: If you will be using a theme that will still require a build process then you shouldn't delete the gesso-related files but rename the `gesso` references to `theme`. For example rename `.ddev/docker-compose.gesso.yml` to `.ddev/docker-compose.theme.yml`. You will also want to update the files noted below for editing to include the proper build processes and references for the custom theme._

- Delete the following files/directories:
  - `.ddev/docker-compose.gesso.yml`
  - `.ddev/commands/gesso/gesso`
  - `web/wp-content/themes/gesso`
- Edit the following files:
  - `Dockerfile` and delete any lines related to building or copying `gesso`.
  - `.gitignore` and delete references to the Gesso theme directory.
  - `.phpcs.xml.dist` and delete references to the Gesso theme directory.
  - `phpstan.neon.dist` and delete references to the Gesso theme directory.

