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
      recommendation,
      thumbedDown,
      thumbedUp,
      thumbsDown,
      thumbsUp
    } = this.props
    const {getMenuId} = this.context

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
            onUp={onFarRight}
            onDown={onDown}
            onLeft={onLeft}
            onRight={changeFocus(getMenuId('restart'))}>
            &nbsp;
          </Button>
          <Button mid={getMenuId('restart')}
            className={cx('regularButton', {
              'back15-off': !isFocused(getMenuId('restart')),
              'back15-on': isFocused(getMenuId('restart'))
            })}
            focused={isFocused(getMenuId('restart'))}
            disabled={false}
            onClick={restart}
            onFocus={() => this.displayToolTip('restart')}
            onBlur={() => this.hideToolTip('restart')}
            onUp={onFarRight}
            onDown={onDown}
            onLeft={changeFocus(getMenuId('previous'))}
            onRight={changeFocus(getMenuId('pause'))}>
            &nbsp;
          </Button>
          <Button mid={getMenuId('pause')}
            className={playPauseIconClass}
            focused={isFocused(getMenuId('pause'))}
            onFocus={() => this.displayToolTip('pause')}
            onBlur={() => this.hideToolTip('pause')}
            onLeft={changeFocus(getMenuId('restart'))}
            onRight={changeFocus(getMenuId('skip'))}
            onDown={onDown}
            onUp={onFarRight}
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
            onRight={onRight}
            onDown={onDown}
            onUp={onFarRight}
            onClick={forwardSkip}>
            &nbsp;
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
export default PlayerControls
