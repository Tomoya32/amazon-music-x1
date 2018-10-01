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
        REACT_APP_AMAZON_MUSIC_CLIENT_ID: 'amzn1.application-oa2-client.364cc7e64af04ec5b96bbbdb985a4df2',
        REACT_APP_AMAZON_CODE_CLIENT_ID: 'amzn1.application-oa2-client.3b25f0dda98045dfa0d99cb5721ce8d4',
        REACT_APP_SERIAL_NUMBER: 'mikerocks',
        REACT_APP_MUSIC_ENDPOINT: 'http://amazon-x1-proxy.weade.co/api',
        REACT_APP_AUTH_ENDPOINT: 'http://amazon-x1-proxy.weade.co/auth/auth/O2/',
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
      host : 'doorkey.weade.co',
      ref  : 'origin/mike',
      repo : 'git@github.com:adiffengine/amazon-music-x1.git',
      path : '/var/www/apps/amazon-x1-mike',
      'post-deploy' : 'npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env development'
    }
  }
}