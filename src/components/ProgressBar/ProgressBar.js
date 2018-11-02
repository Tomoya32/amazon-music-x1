import React, { Component } from 'react'
import style from './ProgressBar.scss'
import { fancyTimeFormat } from '../../lib/utils'
import isNumber from 'lodash/isNumber'
import cx from 'classnames'

const getPlayerTime = (currentTime, duration, focused) => {
  if (isNumber(currentTime)) {
    let fancyCurrentTime = fancyTimeFormat(currentTime)
    let fancyDuration

    if (isNumber(duration)) {
      fancyDuration = fancyTimeFormat(duration)
    }

    return (
      <div className='playTimeContainer'>
        <div className='playTimeDisplay'>{fancyCurrentTime}</div>
        <div className='playTimeDisplay'>{fancyDuration}</div>
      </div>
    )
  } else {
    return (
      <div className='playTimeContainer'>
        <div className='playTimeDisplay'>--:--</div>
        <div className='playTimeDisplay'>--:--</div>
      </div>
    )
  }
}

export default class ProgressBar extends Component {
  render () {
    const {currentTime, duration, focused, progressBarTime} = this.props
    let progressTime = (focused) ? progressBarTime : currentTime;
    const progress = (isNumber(duration) && isNumber(progressTime)) ? (progressTime / duration) : 0

    return (
      <div className={style.ProgressBar}>
        <div className='barWrapper'>
          {getPlayerTime(currentTime, duration)}
          <div className='bar' />
          <div className={cx({focused}, 'indicator')} style={{width: `${(progress || 0) * 100}%`}} />
        </div>
      </div>
    )
  }
}
