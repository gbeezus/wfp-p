# Pantheon hosted project,

* Rename `.buildkite/pipeline.pantheon.yml` to `.buildkite/pipeline.deploy.yml`.
* Modify the following variables: (*Note:* Your site UUID and environment appear in the dashboard URL `https://dashboard.pantheon.io/sites/[UUID]#[ENVIRONMENT]`)
	* `.buildkite/pipeline.deploy.yml` > `[SSH_REPO_FROM_PANTHEON]`
		* This is the Git SSH Clone URL under Connection Info in the dashboard: `ssh://codeserver.dev.[UUID]@codeserver.dev.[UUID].drush.in:2222/~/repository.git`
	* `.buildkite/pipeline.deploy.yml` > `[PANTHEON_HOST]`
		* This will be `codeserver.dev.[UUID].drush.in:2222`
	* `.ddev/providers/pantheon.yaml` > `[PROJECT.KEY]`, see the instructions in the `pantheon.yml` file.
		* This breaks down into `[UUID].[ENVIRONMENT]`
* Update the `.buildkite/pipeline.yml` file, changing the `DOCKERFILE_STAGE_TARGET` environment variable, to target the `pantheon` Dockerfile stage instead of `artifact` for both building the Test & Release image builds.
* Delete the `.ddev/php/f1-php.ini` file.
* Delete the `.ddev/php/wpengine-php.ini` file.
* Delete the `.ddev/providers/f1.yaml` file.
* Delete the `.buildkite/pipeline.f1.yml` file.
* Delete the `.buildkite/pipeline.wpengine.yml` file.
* Delete the `.buildkite/post-deploy.wpengine.sh` file.
* Delete the `web/wp-config.wpengine.php` file.
* Delete the `web/wp-content/config` directory.
* Delete the `capistrano` directory.
* Delete the `Capfile` file.
* Delete the `Gemfile` file.

## PHP Memory Limit Configuration

Update the `.ddev/php/pantheon-php.ini` file to include the correct configuration for the local DDev environment that matches the hosting environment. (see: https://docs.pantheon.io/guides/account-mgmt/plans/resources)

## Include More Branches for MultiDev on Pantheon

Update the `.buildkite/pipeline.deploy.yml` file.

```yaml
branches:
  - match: live
    target: master
  ...
  - match: [branch name on f1 github]
    target: [multi-dev name]
```
```yaml
branches:
  - live
  - main
  - integration
  - [branch name on f1 github]
  plugins:
  ...
```

