import React, { Component } from 'react'
import './Player.scss'
import $badger from '../../lib/badger'
import debugWrapper from 'debug'
import { logError } from '../../lib/logger'
import gt from 'lodash/get'
import playerConfig from '../../lib/config'
import config from '../../config'
import {isNumeric} from '../../lib/utils'
// import ReactHLS from 'react-hls';
import ReactHLS from '../ReactHLS/react-hls';

const debug = debugWrapper('app:player')

export default class Player extends Component {

  static defaultProps = {
    disableTimeUpdates: false,
    disableOnEnded: true
  }

  componentDidMount () {
    this._lastTimeUpdate = 0
  }

  componentWillUnmount () {
    this.stopMonitoringPlayback()
  }

  monitorPlayback () {
    // triggered by onPlay
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
    clearInterval(this._heartbeat)
  }

  pause () {
    if (this.player.paused) this.player.play()
    else this.player.pause()
  }

  onEnded (event) {
    event.persist()
    const { onEnded} = this.props
    onEnded()
  }

  errorHandler (e, code = 301) {
    const {playerUrl, errorHandler} = this.props
    debug('Playback Error on stream %s', playerUrl, e)
    $badger.errorMetricsHandler('PlaybackError', false, code, {
      message: e ? e.message : 'no message passed',
      url: playerUrl
    })

    if(errorHandler) errorHandler(e)

  }

  checkIfPlayed () {
    clearTimeout(this.__checktimeout)
    this.__checktimeout = setTimeout(() => {
      if (this.player) {
        if (this.player.currentTime < 1) {
          // this could also be triggered by autoplaying the song and immediately pausing it
          this.errorHandler(new Error('Stream has never seemed to play'), 302)
        }
      }
    }, config.player.timeout_check_frequency)
  }

  componentDidUpdate (prevProps) {

    const {updateCurrentTime, updatePlayTime, playerControlsState, playerState, playerUrl, setCurrentTime, updateInitOnUpdate, disableInitOnUpdate} = this.props
    const oldPlayerUrl = prevProps.playerUrl
    if (playerUrl !== oldPlayerUrl) {
      // this._lastTimeUpdate = 0
      if (disableInitOnUpdate) {
        debugger
        updateInitOnUpdate(false)
      }
      // if (playerState === 'playing') {
      // setTimeout(() => {
      //   const {playerState} = this.props
      //   if (playerState === 'playing' &&  this.player && this.player.paused) {
      //     this.player.play()
      //   }
      // }, 1000)
      // this.checkIfPlayed()
      // }
    } else {
      if (!disableInitOnUpdate) {
        debugger
        updateInitOnUpdate(true)
      }
    }

    if (playerState === 'playing' && prevProps.playerState === 'paused') {
      this.checkIfPlayed()
    }

    if (this.player && prevProps.updateCurrentTime !== updateCurrentTime && isNumeric(updateCurrentTime)) {
      // restarts song
      // Validations
      try {
        this.player.currentTime = updateCurrentTime
        updatePlayTime(this.player.currentTime)
      } catch (e) {
        console.error(e)
        $badger.errorMetricsHandler('UpdatePlayerTimeError', false, 300, {message: e ? e.message : 'no message'})
        updatePlayTime(this.player.currentTime)
      }
      setCurrentTime(null)
    }

    const pausedState = this.player.paused ? 'paused' : 'playing'
    if (this.player && pausedState !== playerState) {
      // will play or pause the song
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
  }

  onTimeUpdate (time) {
    const {playerControlsState, setPlayerControlsState} = this.props
    const {disable_time_updates} = config.player;
    if (!disable_time_updates && (time > this._lastTimeUpdate && (time - this._lastTimeUpdate) > 1) || time < this._lastTimeUpdate) {
      if (this.player) {
        if (playerControlsState === 'paused' && !this.player.paused) setPlayerControlsState('playing')
        else if (playerControlsState === 'playing' && this.player.paused) {
          // this shouldn't be called after pressing pause!
          setPlayerControlsState('paused')
        }
      }
      if (time > 0) {
        this._lastTimeUpdate = time
        this.props.updatePlayTime(time)
      } else {
      }
    }
  }

  render () {
    const {
      disableInitOnUpdate,
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
    debugger
    return (
      <div ref={(div) => this._wrapperDiv = div} className={'playerWrapper'}>
        <ReactHLS url={playerUrl}
          controls={false}
          autoplay={playerState === 'playing'}
          disableInitOnUpdate={disableInitOnUpdate}
          preload={true}
          ref={element => {
            this.player = element ? element.refs.video : element
          }}
          videoProps={{
            onError: event => {
              event.persist()
              const e = event.target.error
              this.errorHandler(e)
            },
            onTimeUpdate: event => {
              event.persist() // Not sure what I was doing wrong but this was required on some events or React would get mad
              if (!disableTimeUpdates) this.onTimeUpdate(event.target.currentTime)
            },
            onLoadStart: (event) => {
              $badger.userActionMetricsHandler('PlayerOnLoadStart')
              event.persist()
              onReadyStateChange(event.target.readyState)
              onLoadStart()
            },
            onLoadedData: (event) => {
              $badger.userActionMetricsHandler('PlayerOnLoadedData')
              event.persist()
              onReadyStateChange(event.target.readyState)
              onLoadEnd()
            },
            onCanPlay: (event) => {
              $badger.userActionMetricsHandler('PlayerOnCanPlay')
              event.persist()
              onReadyStateChange(event.target.readyState)
              // add this if needed: onCanPlay()
            },
            onLoadedMetadata: event => {
              $badger.userActionMetricsHandler('PlayerOnLoadedMetadata')
              event.persist()
              onReadyStateChange(event.target.readyState)
              gotDuration(event.target.duration)
            },
            onPause: (event) => {
              $badger.userActionMetricsHandler('PlayerOnPause')
              $badger.userActionMetricsHandler('PausedPlaybackHeartbeat', {playerTime: event.target.currentTime})
              event.persist()
              setPlayerControlsState('paused')
            },
            onPlay: (event) => {
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
