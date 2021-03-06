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
    disableTimeUpdates: false
  }

  componentDidMount () {
    this._lastTimeUpdate = 0
    this._actualTime = 0
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
            $badger.userActionMetricsHandler('NormalPlaybackHeartbeat', {currentTime: this.player.currentTime})
          } else {
            $badger.userActionMetricsHandler('PausedPlaybackHeartbeat', {currentTime: this.player.currentTime})
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
    this.props.onEnded()
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
        if (this.player.currentTime < 0.001) {
          // this could also be triggered by autoplaying the song and immediately pausing it
          this.errorHandler(new Error('Stream has never seemed to play'), 302)
        }
      }
    }, config.player.timeout_check_frequency)
  }

  componentDidUpdate (prevProps) {

    const {currentTime, playerControlsState, playerState, playerUrl, updateInitOnUpdate, setPlayerState} = this.props
    const oldPlayerUrl = prevProps.playerUrl
    if (playerUrl !== oldPlayerUrl) {
      this._lastTimeUpdate = 0
      this._actualTime = 0
        setTimeout(() => {
          if (this.player.paused) setPlayerState('playing')
        }, 1000)
    }

    // not sure if `checkIfPlayed` is needed in the future
    // if (playerState === 'playing' && prevProps.playerState === 'paused') {
    //   this.checkIfPlayed()
    // }

    if (this.player && prevProps.currentTime !== currentTime && isNumeric(currentTime)) {
      if (this.props.currentTime == 0) {
        this._actualTime = 0;
        this._lastTimeUpdate = 0;
        this.player.currentTime = 0;
      }
    }

    const pausedState = this.player.paused ? 'paused' : 'playing'
    if (this.player && pausedState !== playerState) {
      // will play or pause the song
      debug(`Player - playerState ${playerState}  playerControlsState: ${playerControlsState} player is ${pausedState} playerUrl: `)
      if (playerState === 'playing' && this.player.paused && playerUrl === oldPlayerUrl) {
        try {
          debug('Calling play on player')
          this.player.currentTime = this.props.currentTime;
          this.player.play()
        } catch (e) {
          console.error(`Error calling play ${e.message}`)
        }
      } else if (playerState === 'paused' && !this.player.paused) {
        this.player.pause()
      }
    }
  }

  updateTimes(time) {
    this._lastTimeUpdate = time
    if (this.player) this.props.setCurrentTime(this._actualTime)
  }

  onTimeUpdate (time) {
    const { disableTimeUpdates, currentTime } = this.props;
    if (!disableTimeUpdates && time > 0) {
      if (time - this._actualTime > 1) {
        this._actualTime = time
        console.log(`Timer increasing normally, time = `,time)
        this.updateTimes(time)
      } else if (time < this._actualTime) {
        // X1 receives time=0 onPlay
        if (currentTime !== this._actualTime) {
          // scrubbed left / right
          this._actualTime = currentTime;
          this._lastTimeUpdate = currentTime;
        }
        if (this._lastTimeUpdate > time) this._lastTimeUpdate = time
        if (time - this._lastTimeUpdate > 1) {
          // normal pause/play
          this._actualTime += time - this._lastTimeUpdate
          $badger.userActionMetricsHandler('onTimeUpdate', {adjustedTime: this._actualTime})
          console.log(`onTimeUpdate received time = ${time}. Setting currentTime=${this._actualTime}`)
          this.updateTimes(time)
        }
      }
    }
  }

  render () {
    const {
      playerControlsState,
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
              $badger.userActionMetricsHandler('PlayerOnError', {error: event.target.error})
              event.persist()
              const e = event.target.error
              this.errorHandler(e)
            },
            onTimeUpdate: event => {
              event.persist() // Not sure what I was doing wrong but this was required on some events or React would get mad
              if (!disableTimeUpdates) this.onTimeUpdate(event.target.currentTime)
            },
            onLoadStart: (event) => {
              $badger.userActionMetricsHandler('PlayerOnLoadStart', {readyState: event.target.readyState})
              event.persist()
              onReadyStateChange(event.target.readyState)
              onLoadStart()
            },
            onLoadedData: (event) => {
              $badger.userActionMetricsHandler('PlayerOnLoadedData', {readyState: event.target.readyState})
              event.persist()
              onReadyStateChange(event.target.readyState)
              onLoadEnd()
            },
            onCanPlay: (event) => {
              $badger.userActionMetricsHandler('PlayerOnCanPlay', {readyState: event.target.readyState})
              event.persist()
              onReadyStateChange(event.target.readyState)
              // add this if needed: onCanPlay()
            },
            onLoadedMetadata: event => {
              $badger.userActionMetricsHandler('PlayerOnLoadedMetadata', {readyState: event.target.readyState})
              event.persist()
              onReadyStateChange(event.target.readyState)
              gotDuration(event.target.duration)
            },
            onPause: (event) => {
              $badger.userActionMetricsHandler('PlayerOnPause', {currentTime: event.target.currentTime})
              event.persist()
              if (playerControlsState === 'playing') setPlayerControlsState('paused')
            },
            onPlay: (event) => {
              this.monitorPlayback()
              $badger.userActionMetricsHandler('PlayerOnPlay', {currentTime: event.target.currentTime})
              event.persist()
              if (playerControlsState === 'paused') setPlayerControlsState('playing')
            },
            onEnded: (event) => {
              event.persist()
              this.onEnded()
            }
          }}

        />
      </div>
    )
  }
}
