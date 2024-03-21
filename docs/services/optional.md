# Optional Resources

## Adding composer install upon starting a project

If you want to have Composer run `composer install` every time a project is started, add the following in the `.ddev/config.yaml`. (*NOTE*: This will increase the time it takes to start up a project every time.)

```yaml
hooks:
  post-start:
    - exec: "composer install"
```

