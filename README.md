# WordPress + Faust Pantheon Experiment

## Development Branch Naming & Workflow

- Always create Feature and Bugfix branches from the `main` branch.
- When needed, create Hotfix branches from `live`.
- Merge, or submit a Pull Request, from Feature/Bugfix/Hotfix branches to `integration` for Development/Integration environment deployments.
- Submit a Pull Request from Feature/Bugfix branches to `main` for QA/Staging environment deployments.
- Submit a Pull Request from Hotfix branches to `live` for Production environment deployments.
- Submit a Pull Request from `main` to `live` for all regular Production releases.

## Project Setup Instructions

To set up the local environment, do the following:

1. Install [`docker`](https://docs.docker.com/install/) and [`docker-compose`](https://docs.docker.com/compose/install/), if not already installed.

2. Install [`DDEV`](https://ddev.readthedocs.io/en/stable/#installation)

3. Clone this repository.
```
git clone git@github.com:forumone/wordpress-faustjs-project.git
```

4. Create a `.env` in the project root directory for local development. See the `.env.local` file for an example. (NOTE: You will need to supply valid license keys and/or download URLS in the *PLUGIN LICENSE KEYS* section for premium plugins to install.)

5. Private Composer repository access.

    1. Get an API Token for the repository.
        - Forum One Developer: Find the "F1 WP Composer Repo Key" entry in Bitwarden for API token.
        - Vendor/Client: Get the API token from your Forum One point of contact.
    2. Create an `auth.json` file in the project root directory.
    3. Enter the access detail into the `auth.json` file.

        ```
        {
            "http-basic": {
                "satispress.forumone.dev": {
                    "username": "<API Token>",
                    "password": "<API Token Password>"
                }
            }
        }
        ```

    4. Confirm the `auth.json` file is listed in the `.gitignore` file in the project root directory to ensure that it doesn’t get committed to the git repository.

6. Run:
```
ddev start
```

7. Install WordPress core and plugins.
```
ddev composer install
```

8. Install theme development dependencies and build.
```
ddev gesso install
ddev gesso build
```

9. Retrieve a copy of an environment(Dev/Stage/Live) database and unpack to `./export.sql` The database file can be named anything, but you'll need to know the file name for the next step. **You can also leverage the Forum One or Pantheon hosting DDev providers to import the database and skip step 10.**

    - Forum One Hosting: `ddev auth ssh && ddev pull f1`
      1. Copy your machine SSH config to the DDev global settings directory.
        - `mkdir ~/.ddev/homeadditions/.ssh && cp ~/.ssh/config ~/.ddev/homeadditions/.ssh/`
      2. `ddev auth ssh && ddev pull f1`
    - Pantheon Hosting: `ddev auth ssh && ddev pull pantheon`
      -	See: [Pantheon Authentication for DDev](https://forumone.atlassian.net/wiki/spaces/TECH/pages/35749891/How-to+Using+Terminus+for+Pantheon+Sites#Authentication)

10. Import the database.
```
ddev wp db import export.sql
```

11. Fix local DB URLs.
```
ddev wp search-replace '<environment domain>' '<PROJECT_ID>.ddev.site' --all-tables
```

12. Flush the cache.
```
ddev wp cache flush
```

13. Load the environment configuration.
```
ddev wp config pull all
```

14. Initial app setup:
```
cd app
cp .env.local.example .env.local
nvm use
npm ci
```

15. Connect Faust and Next. Open [Faust settings](https://wordpress-faustjs-project.ddev.site/wp/wp-admin/options-general.php?page=faustwp-settings) and:

    - Set the **Front-end site URL** to http://localhost:3000
    - Save the Secret Key to FAUST_SECRET_KEY in `app/.env.local`

16. Start the frontend (in `app/`):
```
npm run dev
```

- More info in the `app/README.md`

17. Like Gesso, the custom blocks plugin has been equipped with ddev commands. To prepare the block plugin, begin by running the install.

```
ddev customblocks install
```

18. Build the plugin files
```
ddev customblocks build
```

19. To run the plugin build in watch mode you can run the following

```
ddev customblocks dev
```

- Additional commands can be found in .ddev/commands/customblocks

## Building/Watching Theme File Changes

1. Build the theme assets.
```
ddev gesso build
```
2. Watch for changes
```
ddev gesso watch
```

## Environments

- Dev:
- Stage:
- Prod:

## Additional Resources

### Xdebug

- To enable `ddev xdebug on`
- To disable xdebug `ddev xdebug off`

### Linting

Following linting tools are available for local development with their current commands:

- `phpstan` > `ddev phpstan` > Uses config file `phpstan.neon.dist`.
- `phpcs` > `ddev phpcs` > Runs standard command outlined in the `.phpcs.xml.dist`
- `eslint` > `ddev gesso eslint` > Only scans the theme folder. (Default: web/themes/gesso)
- `stylelint` > `ddev gesso stylelint` > Only scans the theme folder. (Default: web/themes/gesso)

These commands can be found in the following directory: `.ddev/commands/web` & `.ddev/commands/gesso`

#### Resources

Additional documentation for linting, including setting up your IDE to reporting on issues as your making changes, can be found in Confluence in the [Tech Team Linting section](https://forumone.atlassian.net/wiki/spaces/TECH/pages/32964621/Linting).

### Performance for Local Development

With `DDev 1.19` there was a service that was included called `Mutagen`. Mutagen allows for a `2 way sync` for the code base into a `docker container`.
Some of the things to think about when using `Mutagen`

- Uses a lot more disk space
- Can get out of sync if you run `npm install` for the first time, `composer install` installing a lot of new packages, and huge `git` operations
  - To re-sync `ddev mutagen sync`
  - To monitor mutagen `ddev mutagen monitor`

Reference: [Mutagen documentation](https://ddev.readthedocs.io/en/latest/users/install/performance/#filesystem-performance)

To enable mutagen for a specific project please create a file `.ddev/config.mutagen.yaml` **DO NOT COMMIT THIS FILE.**
 ```yaml
 mutagen_enabled: true
 ```
**NOTE:** Note mutagen is only really intended for Mac OS, but it may also be used on Windows.

