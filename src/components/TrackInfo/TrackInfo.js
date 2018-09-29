import React from 'react'
import './TrackInfo.css'
import Space from '../../lib/reactv-redux/SpaceRedux'
import {Buttonizer} from '../../lib/reactv-navigation'
import cx from 'classnames'


let NextTrackButton = Buttonizer(({focused}) => (
  <div className={cx('NextButton', {focused})}>Next</div>
))

const TrackInfo = ({title, artist, album, image, isFocused}) => (
  <div className='TrackInfo'>
    {image && (<img src={image.uri} alt={title} />)}
    <div className={'TrackDeets'}>
      <div>
        <h1>{title}</h1>
        {artist && artist.name && (<h2>{artist.name}</h2>)}
        {album && album.name && (<h3>{album.name}</h3>)}
        <NextTrackButton menuid="nextTrack" onEnter={() => {
          console.info('do this')
        }} focused={isFocused('nextTrack')}/>
      </div>
    </div>
  </div>
)

export default Space(TrackInfo)
