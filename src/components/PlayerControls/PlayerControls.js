import React, { Component } from 'react'
import style from './PlayerControls.scss'
import Button from '../PlayerControlButton'
import PropTypes from 'prop-types'
import cx from 'classnames'
import gt from 'lodash/get'
import dw from 'debug'

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

    return (
      <div className={style.PlayerControls}>
        <div className='controls'>
          {showThumbs && <Button mid={getMenuId('thumbsDown')}
            focused={isFocused(getMenuId('thumbsDown'))}
            onClick={() => { giveThumbs('thumbs_down') }}
            onDown={onDown}
            onFocus={() => this.displayToolTip('thumbsDown')}
            onBlur={() => this.hideToolTip('thumbsDown')}
            className={classForThumbsDown}
            onLeft={onLeft} onRight={changeFocus(getMenuId('previous'))}>
            &nbsp;
          </Button>}
          <Button mid={getMenuId('previous')}
            className={cx('regularButton', {
              'previous-off': !isFocused(getMenuId('previous')),
              'previous-on': isFocused(getMenuId('previous'))
            })}
            focused={isFocused(getMenuId('previous'))}
            disabled={false}
            onClick={backwardSkip}
            onFocus={() => this.displayToolTip('previous')}
            onBlur={() => this.hideToolTip('previous')}
            onDown={onDown}
            onLeft={(showThumbs) ? changeFocus(getMenuId('thumbsDown')) : onLeft}
            onRight={changeFocus(getMenuId('pause'))}>
            &nbsp;
          </Button>
          <Button mid={getMenuId('pause')}
            className={playPauseIconClass}
            focused={isFocused(getMenuId('pause'))}
            onFocus={() => this.displayToolTip('pause')}
            onBlur={() => this.hideToolTip('pause')}
            onLeft={changeFocus(getMenuId('previous'))}
            onRight={changeFocus(getMenuId('skip'))}
            onDown={onDown}
            onClick={togglePlayState}>
            &nbsp;
          </Button>
          <Button mid={getMenuId('skip')}
            className={cx('regularButton', {
              'skip-off': !isFocused(getMenuId('skip')),
              'skip-on': isFocused(getMenuId('skip'))
            })}
            focused={isFocused(getMenuId('skip'))}
            onFocus={() => this.displayToolTip('skip')}
            onBlur={() => this.hideToolTip('skip')}
            onLeft={changeFocus(getMenuId('pause'))}
            onRight={(showThumbs) ? changeFocus(getMenuId('thumbsUp')) : onRight}
            onDown={onDown}
            onClick={forwardSkip}>
            &nbsp;
          </Button>
          {showThumbs && <Button mid={getMenuId('thumbsUp')}
            focused={isFocused(getMenuId('thumbsUp'))}
            onClick={() => { giveThumbs('thumbs_up') }}
            onDown={onDown}
            onFocus={() => this.displayToolTip('thumbsUp')}
            onBlur={() => this.hideToolTip('thumbsUp')}
            className={classForThumbsUp}
            onLeft={changeFocus(getMenuId('skip'))} onRight={onRight}>
            &nbsp;
          </Button>}
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
export default PlayerControls
