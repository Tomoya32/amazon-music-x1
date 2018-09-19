import React from 'react'
import './TrackInfo.css'
import Space from '../../lib/reactv-redux/SpaceRedux'
import {Buttonizer} from '../../lib/reactv-navigation'
import cx from 'classnames'


const NextTrackButton = Buttonizer(({focused, children}) => (
  <div className={cx('NextButton', {focused})}>{children}</div>
))

const TrackInfo = ({title, artist, album, image, onNext, onShuffleNext, isFocused, changeFocus}) => (
  <div className='TrackInfo'>
    {image && (<img src={image.uri} alt={title} />)}
    <div className={'TrackDeets'}>
      <div>
        <h1>{title}</h1>
        {artist && artist.name && (<h2>{artist.name}</h2>)}
        {album && album.name && (<h3>{album.name}</h3>)}
        <NextTrackButton menuid="nextTrack" onEnter={onNext} focused={isFocused('nextTrack')} onDown={changeFocus('shuffleNextTrack')}>Next</NextTrackButton>
        <br />
        <NextTrackButton menuid="shuffleNextTrack" onEnter={onNext} focused={isFocused('shuffleNextTrack')} onUp={changeFocus('nextTrack')}>Shuffle Next</NextTrackButton>
      </div>
    </div>
  </div>
)

export default Space(TrackInfo)