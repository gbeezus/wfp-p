# Revert the database when a rollback occurs
Rake::Task["deploy:rollback_release_path"].enhance do
  invoke "wordpress:revert_database"
end

# Backup the database when publishing a new release
Rake::Task["deploy:published"].enhance ["wordpress:dbbackup"]

# After publication run updates
Rake::Task["deploy:published"].enhance do
  Rake::Task["wpcli:update"].invoke
  Rake::Task["wpcli:shuffle_salts"].invoke
end

namespace :wordpress do
  task :settings do
    on roles(:app) do
      # If a .env file exists then this is a dotEnv setup and we don't need to link wp-config files.
      unless test " [ -f #{current_path}/#{fetch(:app_webroot, 'web')}/../.env ]"
        if test " [ -f #{current_path}/#{fetch(:app_webroot, 'web')}/wp-config.php ]"
          execute :rm, "-f", "#{current_path}/#{fetch(:app_webroot, 'web')}/wp-config.php"
        end

        execute :ln, '-s', "#{current_path}/#{fetch(:app_webroot, 'web')}/wp-config.#{fetch(:stage)}.php", "#{current_path}/#{fetch(:app_webroot, 'web')}/wp-config.php"
      end

      # If a .htaccess file for the stage exists
      if test " [ -f #{current_path}/#{fetch(:app_webroot, 'web')}/htaccess.#{fetch(:stage)} ]"
        # If there is currently an .htaccess file
        if test " [ -f #{current_path}/#{fetch(:app_webroot, 'web')}/.htaccess ]"
          execute :rm, "#{current_path}/#{fetch(:app_webroot, 'web')}/.htaccess"
        end

        execute :ln, '-s', "#{current_path}/#{fetch(:app_webroot, 'web')}/htaccess.#{fetch(:stage)}", "#{current_path}/#{fetch(:app_webroot, 'web')}/.htaccess"
      end
    end
  end

  task :dbbackup do
    invoke "wpcli:dbexport"
  end

  desc "Revert the database"
  task :revert_database do
    on roles(:db) do
      within "#{release_path}/#{fetch(:app_webroot, 'web')}" do
        execute :gunzip, "#{release_path}/db.sql.gz"
        execute :wp, "db import", "#{release_path}/db.sql"
      end
    end
  end
end
