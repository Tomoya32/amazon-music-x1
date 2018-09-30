module.exports = {
  apps : [

    // First application
    {
      name      : 'doorbell-x1',
      script    : 'serve',
      env : {
        "PM2_SERVE_PATH": './build',
        "PM2_SERVE_PORT": 8002
      },
      env_production : {
        NODE_ENV: 'production',
        PORT: '8001'
      },
      env_development : {
        NODE_ENV: 'development',
        PM2_SERVE_PORT: 8002
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
      repo : 'git@github.com:adiffengine/doorbell-x1.git',
      path : '/var/www/apps/doorbell-x1-staging',
      'post-deploy' : 'npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env development'
    }
  }
}