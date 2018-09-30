module.exports = {
  apps : [

    // First application
    {
      name      : 'doorbell-x1',
      script    : 'serve',
      env : {
        "PM2_SERVE_PATH": './build',
        "PM2_SERVE_PORT": 8084
      },
      env_mike : {
        NODE_ENV: 'development',
        PM2_SERVE_PORT: 8084
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   * pm2 startOrRestart ecosystem.config.dev.js --name=doorbell-x1-staging --env development
   */
  deploy : {
    mike : {
      user : 'deploybot',
      host : 'doorkey-staging.weade.co',
      ref  : 'origin/mike',
      repo : 'git@github.com:adiffengine/amazon-music-x1.git',
      path : '/var/www/apps/amazon-x1-mike',
      'post-deploy' : 'npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env development'
    }
  }
}