import React, { Component } from 'react'
import style from './PlayerControls.scss'
import Button from '../PlayerControlButton'
import PropTypes from 'prop-types'
import cx from 'classnames'
import gt from 'lodash/get'
import dw from 'debug'

const debug = dw('app:player_controls_container')

const tips = {
  fav: {
    style: {
      left: -15, top: 104
    },
    text: 'Favorite',
    display: 'block'
  },
  jump: {
    style: {
      left: 88, top: 104
    },
    text: 'Jump 15 secs',
    display: 'none'
  },
  pause: {
    style: {
      left: 195, top: 104
    },
    text: 'Pause',
    display: 'none'
  },
  next: {
    style: {
      left: 299, top: 104
    },
    text: 'Next',
    display: 'none'
  },
  info: {
    style: {
      left: 375, top: 104
    },
    text: 'Info',
    display: 'block'
  }
}

class PlayerControls extends Component {
  constructor (p) {
    super(p)
    this.state = {
      tooltipStyle: {
        position: 'absolute',
        left: 19,
        top: 104,
        display: 'none'
      },
      toolTipText: 'hi there',
      currentTip: 'none'
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.playerControlsState !== prevProps.playerControlsState &&
      this.state.currentTip === 'pause') {
      this.displayToolTip('pause')
    }
    const currentType = gt(this.props.recommendation, 'attributes.type', 'audio')
    const currentId = gt(this.props.recommendation, 'attributes.uid')
    const oldId = gt(prevProps.recommendation, 'attributes.uid')
    const {changeFocus, focused, isFocused} = this.props
    const {getMenuId} = this.context
    if (currentId !== oldId) {
      debug('cdu', currentId, oldId, currentType, focused, !isFocused(getMenuId('pause')))
      if (currentType !== 'audio' && focused && !isFocused(getMenuId('pause'))) {
        debug('changing focus to paused')
        changeFocus(getMenuId('pause'))()
      }
    }

  }

  displayToolTip (button) {
    const tooltipStyle = Object.assign({}, this.state.tooltipStyle, tips[button].style, {display: tips[button].display})

    let text = tips[button].text
    if (button === 'pause' && this.props.playerControlsState === 'paused') text = 'Play'

    // this.setState({
    //   tooltipStyle, toolTipText: text, currentTip: button
    // })
  }

  hideToolTip (button = 'unknown...') {
    const tooltipStyle = Object.assign({}, this.state.tooltipStyle, {display: 'none'})
    // this.setState({
    //   tooltipStyle
    // })
  }

  render () {
    const {
      isFocused,
      changeFocus,
      playerControlsState,
      togglePlayState,
      skip,
      jumpBack,
      onUp,
      onDown,
      onLeft,
      onFarRight,
      toggleInfo,
      infoShowing,
      recommendation,
      thumbedUp,
      thumbsUp
    } = this.props
    const {getMenuId} = this.context
    const type = gt(recommendation, 'attributes.type', 'audio')
    const playPauseIconClass = cx({
      'pause-on': playerControlsState !== 'paused' && isFocused(getMenuId('pause')),
      'pause-off': playerControlsState !== 'paused' && !isFocused(getMenuId('pause')),
      'play-on': playerControlsState === 'paused' && isFocused(getMenuId('pause')),
      'play-off': playerControlsState === 'paused' && !isFocused(getMenuId('pause')),
      largeButton: true
    })

    const infoIcon = cx({
      'info-off': !infoShowing && !isFocused(getMenuId('info')),
      'info-on': !infoShowing && isFocused(getMenuId('info')),
      'x-off': infoShowing && !isFocused(getMenuId('info')),
      'x-on': infoShowing && isFocused(getMenuId('info')),
      regularButton: true
    })

    const showTooltip = !(this.state.currentTip === 'info' && infoShowing)

    const tooltipStyle = {
      ...this.state.tooltipStyle,
      visibility: showTooltip ? 'visible' : 'hidden'
    }

    const classForInteresting = cx('regularButton', {
      'interesting-on': (isFocused(getMenuId('fav')) && !thumbedUp),
      'interesting-off': (!isFocused(getMenuId('fav')) && !thumbedUp),
      'interesting-set-on': (isFocused(getMenuId('fav')) && thumbedUp),
      'interesting-set-off': (!isFocused(getMenuId('fav')) && thumbedUp)
    })

    return (
      <div className={style.PlayerControls}>
        <div className='controls'>
          <Button mid={getMenuId('fav')}
            focused={isFocused(getMenuId('fav'))}
            disabled={type !== 'audio'}
            onClick={thumbsUp}
            onUp={onFarRight} onDown={onDown}
            onFocus={() => this.displayToolTip('fav')}
            onBlur={() => this.hideToolTip('fav')}
            className={classForInteresting}
            onLeft={onLeft} onRight={changeFocus(getMenuId('jump'))}>
            &nbsp;
          </Button>
          <Button mid={getMenuId('jump')}
            className={cx('regularButton', {
              'back15-off': !isFocused(getMenuId('jump')),
              'back15-on': isFocused(getMenuId('jump'))
            })}
            focused={isFocused(getMenuId('jump'))}
            disabled={type !== 'audio'}
            onClick={jumpBack}
            onFocus={() => this.displayToolTip('jump')}
            onBlur={() => this.hideToolTip('jump')}
            onUp={onFarRight}
            onDown={onDown}
            onLeft={changeFocus(getMenuId('fav'))}
            onRight={changeFocus(getMenuId('pause'))}>
            &nbsp;
          </Button>
          <Button mid={getMenuId('pause')}
            className={playPauseIconClass}
            focused={isFocused(getMenuId('pause'))}
            onFocus={() => this.displayToolTip('pause')}
            onBlur={() => this.hideToolTip('pause')}
            onLeft={() => {
              if (type === 'audio') changeFocus(getMenuId('jump'))()
            }}
            onRight={() => {
              if (type === 'audio') changeFocus(getMenuId('next'))()
              else {
                // Bit of hack to get this to return right on left from other menu
                // changeFocus(getMenuId('info'))()
                onFarRight()
              }
            }}
            onUp={onFarRight}
            onClick={togglePlayState}>
            &nbsp;
          </Button>
          <Button mid={getMenuId('next')}
            focused={isFocused(getMenuId('next'))}
            disabled={type !== 'audio'}
            onFocus={() => this.displayToolTip('next')}
            onBlur={() => this.hideToolTip('next')}
            onLeft={changeFocus(getMenuId('pause'))}
            onRight={changeFocus(getMenuId('info'))}
            onUp={onFarRight}
            className={cx('regularButton', {
              'forward-off': !isFocused(getMenuId('next')),
              'forward-on': isFocused(getMenuId('next'))
            })}
            onClick={skip}>
            &nbsp;
          </Button>
          <Button mid={getMenuId('info')}
            className={infoIcon}
            onFocus={() => this.displayToolTip('info')}
            onBlur={() => this.hideToolTip('info')}
            focused={isFocused(getMenuId('info'))}
            disabled={type !== 'audio'}
            onLeft={changeFocus(getMenuId('next'))}
            onRight={onFarRight}
            onUp={onFarRight}
            onClick={toggleInfo}>
          </Button>
          <div style={tooltipStyle} className='tooltip'>{this.state.toolTipText}</div>
        </div>
      </div>
    )
  }
}

PlayerControls.propTypes = {
  togglePlayState: PropTypes.func.isRequired,
  skip: PropTypes.func.isRequired,
  jumpBack: PropTypes.func.isRequired
}
PlayerControls.contextTypes = {
  getMenuId: PropTypes.func
}
export default PlayerControls
