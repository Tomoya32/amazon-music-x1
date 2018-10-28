import React, { Component } from 'react'
import style from './ProgressBar.scss'
import { fancyTimeFormat } from '../../lib/utils'
import isNumber from 'lodash/isNumber'
import cx from 'classnames'

function resize (x) { return 72 / 108 * x }

const screenWidth = 1280
const barWidth = 2
const spacing = 5
const blockWidth = barWidth + spacing
const count = Math.ceil(screenWidth / blockWidth)
const minHeight = resize(5)
const maxHeight = resize(191)

const getProgressWidth = (percent) => {
  if (!isNaN(percent) && percent !== 0) return Math.floor(100 + (1080 * percent))
  else return 80
}

const getPlayerTime = (currentTime, duration, focused) => {
  const progress = (isNumber(duration) && isNumber(currentTime) && currentTime !== 0) ? (currentTime / duration) : 0
  if (isNumber(currentTime) && currentTime > 0 ){
    let string = fancyTimeFormat(currentTime)
    if (isNumber(duration)) {
      string += `/${fancyTimeFormat(duration)}`
    }
    const progressWidth = getProgressWidth(progress)
    return (
      <div className='playTimeContainer'>
        <div className={cx({focused}, 'innerPlayTimeContainer')} style={{width: progressWidth}}>
          <div className='playTimeDisplay'>{string}</div>
        </div>
      </div>
    )
  } else {
    return null
  }
}
export default class ProgressBar extends Component {
  render () {
    const {currentTime, duration, focused} = this.props
    const progress = (isNumber(duration) && isNumber(currentTime)) ? (currentTime / duration) : 0

    return (
      <div className={style.ProgressBar}>
        {getPlayerTime(currentTime, duration, focused)}
        <div className='bar'>
          <div className={cx({focused}, 'indicator')} style={{width: getProgressWidth(progress)}} />
        </div>
      </div>
    )
  }
}
