ARG PHP_VERSION="8.1"
ARG COMPOSER_VERSION="2.6"
ARG NODE_VERSION="18"

FROM forumone/composer:${COMPOSER_VERSION}-php-${PHP_VERSION} AS base

WORKDIR /var/www/html

# This will copy everything into the dockerfile other than
# those excluded in the .dockerignore
COPY . .

# Install WordPress & Plugins without dev dependencies.
RUN set -ex \
  && composer install --no-dev --optimize-autoloader

RUN rm ./auth.json

# Build JS assets for the Custom Blocks plugin.
FROM forumone/gesso:node-v18-php-8.1 AS custom-blocks-plugin

# Install npm dependencies
COPY ["web/wp-content/plugins/custom-block-library/package*.json", "./"]

RUN if test -e package-lock.json; then npm ci; else npm i; fi

# Copy sources and build
COPY ["[web|public]/wp-content/plugins/custom-block-library", "./"]

RUN set -ex \
  && npm run build \
  && rm -rf node_modules

# Build Gesso linting & build base image.
FROM forumone/gesso:node-v${NODE_VERSION}-php-${PHP_VERSION} AS theme-base

COPY ["web/wp-content/themes/gesso", "./"]

# Install theme npm dependencies.
RUN if test -e package-lock.json; then npm ci; elif test -e package.json; then npm i; else echo 'No theme found!'; fi

# Build theme .
FROM theme-base AS theme-build

RUN set -ex \
  && npm run build \
  && rm -rf node_modules \
  ./.dockerignore \
  ./.editorconfig \
  ./.eslint* \
  ./.gitignore \
  ./.npmrc \
  ./.nvmrc \
  ./.prettierrc \
  ./.stylelintignore \
  ./.stylelintrc.yml \
  ./babel.config.js \
  ./Dockerfile \
  ./gulpfile.js \
  ./package*.json \
  ./phpcs.xml.dist \
  ./webpack.config.js

# Build PHP linting base image.
FROM base AS php-linting

# Copy theme build in order to have full code base for linting.
COPY --from=theme-base ["/app", "web/wp-content/themes/gesso"]

# Install development dependencies for linting.
RUN composer install

# Build release image.
FROM busybox AS artifact

RUN mkdir -p /var/www/html
WORKDIR /var/www/html

# Copy all artifacts into the production-ready release stage for the final release image.
COPY --from=base ["/var/www/html/web", "./web"]
COPY wp-cli.yml /var/www/html/

# Cleanup directories to overwrite with clean builds.
RUN set -ex \
  && rm -rf web/wp-content/themes/gesso \
  && rm -rf web/wp-content/plugins/custom-block-library

COPY --from=theme-build ["/app", "web/wp-content/themes/gesso"]
# Copy custom block library built content
COPY --from=custom-blocks-plugin ["/app", "web/wp-content/plugins/custom-block-library"]

FROM artifact AS pantheon

# This is for project specific Pantheon tasks.
WORKDIR /var/www/html/web

# Copy all artifacts into the production-ready release stage for the final release image.
COPY pantheon.yml /var/www/html/
# End of project specific Pantheon tasks.

FROM artifact AS wpengine

# This is for project specific WPEngine tasks.
WORKDIR /var/www/html/web

# Remove the WP Core 2022 Theme due to Large File Size Assest.
RUN cp -R wp/wp-admin wp/wp-includes ./ && \
  cp -R wp/wp-content/themes/* ./wp-content/themes && \
  rm wp/composer.json && \
  find wp/ -maxdepth 1 -type f -exec cp {} ./ \; && \
  rm -rf wp && \
  rm -rf wp-content/themes/twentytwentytwo
# End of project specific WPEngine tasks.

# Making `artifact` default build so if you build using the dockerfile
# an image gets build without requireing a `--target` in the argument.
FROM artifact