import React, { Component } from 'react'
import './Player.css'
import $badger from '../../lib/badger'
import config from '../../config'
import {isNumeric} from '../../lib/utils'


export default class Player extends Component {

  static defaultProps = {
    disableTimeUpdates: false,
    disableOnEnded: true
  }


  componentWillUnmount () {
    this.stopMonitoringPlayback()
  }

  monitorPlayback () {
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
    this.resetTracking()
    if (this.player.paused) this.player.play()
    else this.player.pause()
  }

  onEnded (event) {
    event.persist()
    const { onEnded} = this.props
    onEnded()
  }

  errorHandler (e, code = 301) {
    const {playerUrl} = this.props
    console.error('Error playing %s %s', playerUrl, e.message, e)
    $badger.errorMetricsHandler('PlaybackError', false, code, {
      message: e ? e.message : 'no message passed',
      url: playerUrl
    })
  }

  checkIfPlayed () {
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
    const {updateCurrentTime, updatePlayTime, playerState, userPlayState, playerUrl} = this.props
    const oldPlayerUrl = prevProps.playerUrl
    if (playerUrl !== oldPlayerUrl) {
      this._lastTimeUpdate = 0
      if (userPlayState === 'playing') {
        setTimeout(() => {
          const {userPlayState} = this.props
          if (userPlayState === 'playing' &&  this.player && this.player.paused) {
            this.player.play()
          }
        }, 1000)
        this.checkIfPlayed()
      }
    }

    if (userPlayState === 'playing' && prevProps.userPlayState === 'paused') {
      this.checkIfPlayed()
    }

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
    if (this.player && pausedState !== userPlayState) {
      if (userPlayState === 'playing' && this.player.paused && playerUrl === oldPlayerUrl) {
        try {
          this.player.play()
        } catch (e) {
          console.error(`Error calling play ${e.message}`)
        }
      } else if (userPlayState === 'paused' && !this.player.paused) {
        this.player.pause()
      }
    }
  }

  onTimeUpdate (time) {
    const {playerState, updatePlayerState} = this.props
    if (!config.player.disable_time_updates && (time > this._lastTimeUpdate && (time - this._lastTimeUpdate) > 1) || time < this._lastTimeUpdate) {
      if (this.player) {
        if (playerState === 'paused' && !this.player.paused) updatePlayerState('playing')
        else if (playerState === 'playing' && this.player.paused) updatePlayerState('paused')
      }
      this._lastTimeUpdate = time
      this.props.updatePlayTime(time)
    }
  }

  render () {
    const {
      updatePlayerState,
      gotDuration,
      onCanPlay,
      playerUrl,
      userPlayState,
      onReadyStateChange,
      onLoadStart,
      onLoadEnd,
      disableTimeUpdates,
    } = this.props

    return (
      <div ref={(div) => this._wrapperDiv = div}>
        <audio src={playerUrl}
          controls={false}
          autoPlay={userPlayState === 'playing'}
          preload='metadata'
          ref={element => {
            this.player = element
          }}
          onError={event => {
            event.persist()
            const e = event.target.error
            this.errorHandler(e)
          }}
          onTimeUpdate={event => {
            event.persist() // Not sure what I was doing wrong but this was required on some events or React would get mad
            if (!disableTimeUpdates) this.onTimeUpdate(event.target.currentTime)
          }}
          onLoadStart={(event) => {
            $badger.userActionMetricsHandler('PlayerOnLoadStart')
            event.persist()
            onReadyStateChange(event.target.readyState)
            onLoadStart()
          }}
          onLoadedData={(event) => {
            $badger.userActionMetricsHandler('PlayerOnLoadedData')
            event.persist()
            onReadyStateChange(event.target.readyState)
            onLoadEnd()
          }}
          onCanPlay={(event) => {
            $badger.userActionMetricsHandler('PlayerOnCanPlay')
            event.persist()
            onReadyStateChange(event.target.readyState)
            onCanPlay()
          }}
          onLoadedMetadata={event => {
            $badger.userActionMetricsHandler('PlayerOnLoadedMetadata')
            event.persist()
            onReadyStateChange(event.target.readyState)
            gotDuration(event.target.duration)
          }}
          onPause={(event) => {
            // this.stopMonitoringPlayback()
            $badger.userActionMetricsHandler('PlayerOnPause')
            $badger.userActionMetricsHandler('PausedPlaybackHeartbeat', {playerTime: event.target.currentTime})
            event.persist()
            updatePlayerState('paused')
          }}
          onPlay={(event) => {
            this.monitorPlayback()
            $badger.userActionMetricsHandler('PlayerOnPlay')
            $badger.userActionMetricsHandler('NormalPlaybackHeartbeat', {playerTime: event.target.currentTime})
            event.persist()
            updatePlayerState('playing')
          }}
          onEnded={this.onEnded.bind(this)}

        />
      </div>
    )
  }
}
