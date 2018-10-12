import React, { Component } from 'react'
import './Player.scss'
import $badger from '../../lib/badger'
import debugWrapper from 'debug'
import { logError } from '../../lib/logger'
import gt from 'lodash/get'
import playerConfig from '../../lib/config'
import config from '../../config'
import {isNumeric} from '../../lib/utils'
import ReactHLS from 'react-hls';

const debug = debugWrapper('app:player')

const properties = [
  'autoplay',
  'buffered',
  'controller',
  'controls',
  'controlsList',
  'crossOrigin',
  'currentSrc',
  'currentTime',
  'defaultMuted',
  'defaultPlaybackRate',
  'duration',
  'ended',
  'error',
  'initialTime',
  'loop',
  'mediaGroup',
  'muted',
  'networkState',
  'paused',
  'playbackRate',
  'readyState',
  'seekable',
  'src'
]

export default class Player extends Component {

  static defaultProps = {
    disableTimeUpdates: false,
    disableOnEnded: true
  }

  componentDidMount () {
    this._lastTimeUpdate = 0
    if (playerConfig.showPlaybackDebug) {
      setInterval(() => {
        this.captureProperties()
      }, 3000)
      this._lastTimeUpdate = 0
    }
    this.monitorTimeSpentPlaying()
  }

  componentWillUnmount () {
    this.stopMonitoringPlayback()
    clearInterval(this._timeSpentPlayingInterval)
  }

  monitorPlayback () {
    // debugger
    if (!isNaN(config.player.heartbeat_frequency)) {
      clearInterval(this._heartbeat)
      this._heartbeat = setInterval(() => {
        if (this.player) {
          if (!this.player.paused) {
            $badger.userActionMetricsHandler('NormalPlaybackHeartbeat', {playerTime: this.player.currentTime})
          } else {
            $badger.userActionMetricsHandler('PausedPlaybackHeartbeat', {playerTime: this.player.currentTime})
          }
        } else {
          const players = document.getElementsByName('audio')
          const player = players.length ? players[0] : null
          if (player) {

          } else {
            $badger.userActionMetricsHandler('AbNormalPlaybackHeartbeat', {message: 'No Player Object'})
          }
          debug(`No player to monitor playback with`)
        }
      }, config.player.heartbeat_frequency)
    } else {
      const {playerUrl} = this.props
      $badger.userActionMetricsHandler('HeartbeatsDisabled', {
        heartbeatFrequency: config.player.heartbeat_frequency,
        playerUrl
      })
    }
  }

  stopMonitoringPlayback () {
    // debugger
    clearInterval(this._heartbeat)
  }

  monitorTimeSpentPlaying () {
    // TODO:  how can i do this?
    clearInterval(this._timeSpentPlayingInterval)
    this._timeSpentPlayingInterval = setInterval(() => {
      // const {recommendation} = this.props
      // if (this.player) recommendation.recordAction(NPROneSDK.Action.START, this.player.currentTime)
    }, 1000 * 60 * 5)
  }

  captureProperties () {
    // debugger
    const {setProperties} = this.props
    if (this.player) {
      const atts = properties.reduce((mem, item) => {
        mem[item] = gt(this.player, item)
        return mem
      }, {})
      debug('set properties')
      setProperties(atts)
      return atts
    }
  }

  pause () {
    // debugger
    this.resetTracking()
    if (this.player.paused) this.player.play()
    else this.player.pause()
  }

  onEnded (event) {
    // debugger
    event.persist()
    const { onEnded} = this.props
    onEnded()
    // recommendationEnded()
  }

  errorHandler (e, code = 301) {
    // debugger
    const {playerUrl, errorHandler} = this.props
    debug('Playback Error on stream %s', playerUrl, e)
    $badger.errorMetricsHandler('PlaybackError', false, code, {
      message: e ? e.message : 'no message passed',
      url: playerUrl
    })

    if(errorHandler) errorHandler(e)

  }

  checkIfPlayed () {
    // debugger
    clearTimeout(this.__checktimeout)
    this.__checktimeout = setTimeout(() => {
      if (this.player) {
        if (this.player.currentTime < 1) {
          this.errorHandler(new Error('Stream has never seemed to play'), 302)
        }
      }
    }, config.player.timeout_check_frequency)
  }

  componentDidUpdate (prevProps) {
    const {updateCurrentTime, updatePlayTime, playerControlsState, playerState, playerUrl, setPlayerControlsState} = this.props
    const oldPlayerUrl = prevProps.playerUrl
    if (playerUrl !== oldPlayerUrl) { this._lastTimeUpdate = 0 }
    /*
    if (playerUrl !== oldPlayerUrl) {
      this._lastTimeUpdate = 0
      debug(`New player URL ${playerUrl} old Player Url: ${oldPlayerUrl}`)
      debug(`user player state: ${playerState} - player state: ${this.player.paused ? 'paused' : 'play'}`)

      clearInterval(this._timeSpentPlayingInterval)
      this.monitorTimeSpentPlaying()
      if (playerState === 'playing') {
        setTimeout(() => {
          debug('player check...')
          const {playerState} = this.props
          if (playerState === 'playing' &&  this.player && this.player.paused) {
            this.player.play()
          }
        }, 1000)
        this.checkIfPlayed()
      }
    }

    if (playerState === 'playing' && prevProps.playerState === 'paused') {
      this.checkIfPlayed()
    }
    // Time updates for jumping back and forth
    // debug('player update', prevProps.updateCurrentTime, updateCurrentTime)

    if (this.player && prevProps.updateCurrentTime !== updateCurrentTime && isNumeric(updateCurrentTime)) {
      // Validations
      let updateTime = this.props.updateCurrentTime
      if (updateTime > this.player.duration) updateTime = this.player.duration
      if (updateTime < 0) updateTime = 0
      try {
        // debug('Updating player time', updateTime, this.props.updateCurrentTime)
        this.player.currentTime = updateTime
        updatePlayTime(this.player.currentTime)
      } catch (e) {
        console.error(e)
        $badger.errorMetricsHandler('UpdatePlayerTimeError', false, 300, {message: e ? e.message : 'no message'})
        updatePlayTime(this.player.currentTime)
      }
    }

    const pausedState = this.player.paused ? 'paused' : 'playing'
    // (this.player && pausedState !== playerState): true
    // why is playerState = 'paused'?
    // // debugger
    if (this.player && pausedState !== playerState) {
      debug(`Player - playerState ${playerState}  playerControlsState: ${playerControlsState} player is ${pausedState} playerUrl: `)
      if (playerState === 'playing' && this.player.paused && playerUrl === oldPlayerUrl) {
        try {
          debug('Calling play on player')
          this.player.play()
        } catch (e) {
          console.error(`Error calling play ${e.message}`)
        }
      } else if (playerState === 'paused' && !this.player.paused) {
        this.player.pause()
      }
    }
    */
  }

  onTimeUpdate (time) {
    const {playerControlsState, setPlayerControlsState} = this.props
    const {disable_time_updates} = config.player;
    if (!disable_time_updates && (time > this._lastTimeUpdate && (time - this._lastTimeUpdate) > 1) || time < this._lastTimeUpdate) {
      if (this.player) {
        if (playerControlsState === 'paused' && !this.player.paused) setPlayerControlsState('playing')
        else if (playerControlsState === 'playing' && this.player.paused) setPlayerControlsState('paused')
      }
      this._lastTimeUpdate = time
      this.props.updatePlayTime(time)
    }
  }

  render () {
    const {
      setPlayerControlsState,
      gotDuration,
      onCanPlay,
      playerUrl,
      playerState,
      onReadyStateChange,
      onLoadStart,
      onLoadEnd,
      disableTimeUpdates,
    } = this.props

    return (
      <div ref={(div) => this._wrapperDiv = div}>
        <ReactHLS url={playerUrl}
          controls={true}
          autoplay={playerState === 'playing'}
          preload='metadata'
          ref={element => {
            this.player = element ? element.refs.video : element
            // console.log('paused?',this.player.paused)
            // if (element) { // debugger }
          }}
          videoProps={{
            /*
            onError: event => {
              // debugger
              event.persist()
              const e = event.target.error
              this.errorHandler(e)
            },*/
            onTimeUpdate: event => {
              event.persist() // Not sure what I was doing wrong but this was required on some events or React would get mad
              if (!disableTimeUpdates) this.onTimeUpdate(event.target.currentTime)
            },/*
            onLoadStart: (event) => {
              // debugger
              $badger.userActionMetricsHandler('PlayerOnLoadStart')
              event.persist()
              onReadyStateChange(event.target.readyState)
              onLoadStart()
            },
            onLoadedData: (event) => {
              // debugger
              $badger.userActionMetricsHandler('PlayerOnLoadedData')
              event.persist()
              onReadyStateChange(event.target.readyState)
              onLoadEnd()
            },
            onCanPlay: (event) => {
              // debugger
              $badger.userActionMetricsHandler('PlayerOnCanPlay')
              event.persist()
              onReadyStateChange(event.target.readyState)
              // TODO: nCanPlay()
            },
            onLoadedMetadata: event => {
              // debugger
              $badger.userActionMetricsHandler('PlayerOnLoadedMetadata')
              event.persist()
              onReadyStateChange(event.target.readyState)
              gotDuration(event.target.duration)
            },
            */
            onPause: (event) => {
              // debugger
              // this.stopMonitoringPlayback()
              $badger.userActionMetricsHandler('PlayerOnPause')
              $badger.userActionMetricsHandler('PausedPlaybackHeartbeat', {playerTime: event.target.currentTime})
              event.persist()
              setPlayerControlsState('paused')
            },
            onPlay: (event) => {
              // debugger
              this.monitorPlayback()
              $badger.userActionMetricsHandler('PlayerOnPlay')
              $badger.userActionMetricsHandler('NormalPlaybackHeartbeat', {playerTime: event.target.currentTime})
              event.persist()
              setPlayerControlsState('playing')
            },
            onEnded: () => this.onEnded.bind(this)
          }}

        />
      </div>
    )
  }
}
