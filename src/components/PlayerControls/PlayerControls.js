import React, { Component } from 'react'
import style from './PlayerControls.scss'
import Button from '../PlayerControlButton'
import PropTypes from 'prop-types'
import cx from 'classnames'
import gt from 'lodash/get'
import dw from 'debug'
import ThumbIcon from '../../assets/images/icon/thumb-up.js'
import PauseIcon from '../../assets/images/icon/pauseButton.js'
import PreviousIcon from '../../assets/images/icon/previous-button.js'
import PlayIcon from '../../assets/images/icon/play-icon.js'
import { Space } from '../../lib/reactv-navigation';

const debug = dw('app:player_controls_container')

class PlayerControls extends Component {
  render () {
    const {
      giveThumbs,
      showThumbs,
      thumbRating,
      isFocused,
      changeFocus,
      playerControlsState,
      togglePlayState,
      forwardSkip,
      restart,
      backwardSkip,
      onUp,
      onDown,
      onLeft,
      onRight,
      onFarRight,
      toggleInfo,
      infoShowing,
      thumbsDown,
      thumbsUp
    } = this.props
    const {getMenuId} = this.context

    const thumbedDown = (thumbRating === 'thumbs_down');
    const classForThumbsDown = cx('regularButton', 'thumbs', {
      'thumbsDown-on': (isFocused(getMenuId('thumbsDown')) && !thumbedDown),
      'thumbsDown-off': (!isFocused(getMenuId('thumbsDown')) && !thumbedDown),
      'thumbsDown-set-on': (isFocused(getMenuId('thumbsDown')) && thumbedDown),
      'thumbsDown-set-off': (!isFocused(getMenuId('thumbsDown')) && thumbedDown)
    })

    const thumbedUp = (thumbRating === 'thumbs_up');
    const classForThumbsUp = cx('regularButton', 'thumbs', {
      'thumbsUp-on': (isFocused(getMenuId('thumbsUp')) && !thumbedUp),
      'thumbsUp-off': (!isFocused(getMenuId('thumbsUp')) && !thumbedUp),
      'thumbsUp-set-on': (isFocused(getMenuId('thumbsUp')) && thumbedUp),
      'thumbsUp-set-off': (!isFocused(getMenuId('thumbsUp')) && thumbedUp)
    })

    const playPauseIconClass = cx({
      'pause-on': playerControlsState !== 'paused' && isFocused(getMenuId('pause')),
      'pause-off': playerControlsState !== 'paused' && !isFocused(getMenuId('pause')),
      'play-on': playerControlsState === 'paused' && isFocused(getMenuId('pause')),
      'play-off': playerControlsState === 'paused' && !isFocused(getMenuId('pause')),
      largeButton: true
    })
    const paused = playerControlsState === 'paused'

    return (
      <div className={style.PlayerControls}>
        <div className='ThumbSection'>
          {showThumbs && <Button
            mid={getMenuId('thumbUp')}
            menuid={getMenuId('thumbUp')}
            className={classForThumbsUp}
            focused={isFocused(getMenuId('thumbUp'))}
            onDown={changeFocus(getMenuId('pause'))}
            onRight={changeFocus(getMenuId('thumbDown'))}
            onClick={() => { giveThumbs('thumbs_up') }}
            onUp={onUp}
            onLeft={onLeft}
          >
            <ThumbIcon fill={isFocused(getMenuId('thumbUp')) && '#53aef5'} />
          </Button>}
          {showThumbs && <Button
            mid={getMenuId('thumbDown')}
            menuid={getMenuId('thumbDown')}
            className={cx(`${classForThumbsDown}`,'thumbDown')}
            focused={isFocused(getMenuId('thumbDown'))}
            onDown={changeFocus(getMenuId('pause'))}
            onLeft={changeFocus(getMenuId('thumbUp'))}
            onClick={() => { giveThumbs('thumbs_down') }}
            onUp={onUp}
            onRight={onRight}
          >
            <ThumbIcon fill={isFocused(getMenuId('thumbDown')) && '#53aef5'} />
          </Button>}
        </div>
        <div
          className='controls'>
          <Button
            mid={getMenuId('previousTrack')}
            disabled={false}
            onClick={backwardSkip}
            onFocus={() => this.displayToolTip('previous')}
            onBlur={() => this.hideToolTip('previous')}
            className={cx('previousTrack')}
            focused={isFocused(getMenuId('previousTrack'))}
            onUp={showThumbs && changeFocus(getMenuId('thumbUp'))}
            onDown={onDown}
            onLeft={onLeft}
            onRight={changeFocus(getMenuId('pause'))}
          >
            <PreviousIcon fill={isFocused(getMenuId('previousTrack')) && '#53aef5'} />
          </Button>
          <Button
            mid={getMenuId('pause')}
            menuid={getMenuId('pause')}
            className={playPauseIconClass}
            focused={isFocused(getMenuId('pause'))}
            onLeft={changeFocus(getMenuId('previousTrack'))}
            onRight={changeFocus(getMenuId('nextTrack'))}
            onUp={showThumbs && changeFocus(getMenuId('thumbUp'))}
            onClick={togglePlayState}
            onDown={onDown}
          >
            {paused ? (
              <PlayIcon fill={isFocused(getMenuId('pause')) && '#53aef5'} /> // todo change to play icon
            ) : (
              <PauseIcon fill={isFocused(getMenuId('pause')) && '#53aef5'} />
            )}
          </Button>
          <Button
            mid={getMenuId('nextTrack')}
            className={cx('previousTrack next')}
            focused={isFocused(getMenuId('nextTrack'))}
            onUp={showThumbs && changeFocus(getMenuId('thumbUp'))}
            onDown={onDown}
            onLeft={changeFocus(getMenuId('pause'))}
            onRight={onRight}
            onClick={forwardSkip}
          >
            <PreviousIcon fill={isFocused(getMenuId('nextTrack')) && '#53aef5'} />
          </Button>
        </div>
      </div>
    )
  }
}

PlayerControls.propTypes = {
  togglePlayState: PropTypes.func.isRequired,
  skip: PropTypes.func.isRequired,
  restart: PropTypes.func.isRequired
}
PlayerControls.contextTypes = {
  getMenuId: PropTypes.func
}
export default Space(PlayerControls)
