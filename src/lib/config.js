const config = {
  blinkDelay: 150,
  clearingDelay: 500,
  whiteListContentDomains: ['ondemand.npr.org'],
  whitelistRecommendations: false,
  proxyPlayback: true,
  proxyWhitelist: true,
  showPlaybackDebug: false,
  disableExplore: false,
  preferAAC: false,
  disableAAC: false, // Don't disable both or we get no good audio....
  disableMP3: false,
  filterAggregations: false,
  disableTimeupdates: false,
  monitorPlayback: 60000,
  disableAllAggregations: true, // process.env.NPR_ONE_ENABLE_AGGREGATIONS !== 'true',
  disableAggregations: [468764844,536490290].map(i => i.toString()),
  enableAlerts: false, //true,
  guestPathBlackList: ['/','/linking'],
  useEmailPrefill: true,
  playerCheckTimeout: 15000,
  loginFailCountLimit: 120
}

export default config
