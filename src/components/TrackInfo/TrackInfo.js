import React from 'react'
import './TrackInfo.css'
import Space from '../../lib/reactv-redux/SpaceRedux'
import {Buttonizer} from '../../lib/reactv-navigation'
import cx from 'classnames'
import PlayerControls from '../PlayerControls'


const NextTrackButton = Buttonizer(({focused, shuffle, children}) => {
  if (shuffle)
    return(
      <div className={cx('NextButton', {focused}, {shuffle})}>{children}</div>
    ) 
  else 
      return(
        <div className={cx('NextButton', {focused})}>{children}</div>
      )
  }
)

const TrackInfo = ({ title, artist, album, image, shuffle, onNext, onShuffleNext, isFocused, changeFocus, onDown}) => (
  <div className='TrackInfo'>
    {image && (<img src={image.uri} alt={title} />)}
    <div className={'TrackDeets'}>
      <div>
        <h1>{title}</h1>
        {artist && artist.name && (<h2>{artist.name}</h2>)}
        {album && album.name && (<h3>{album.name}</h3>)}
        <NextTrackButton menuid="nextTrack" onEnter={onNext} focused={isFocused('nextTrack')} onDown={changeFocus('shuffleNextTrack')}>Next</NextTrackButton>
        <br />
        <NextTrackButton menuid="shuffleNextTrack" onEnter={onShuffleNext} shuffle={shuffle} focused={isFocused('shuffleNextTrack')} onUp={changeFocus('nextTrack')}
        onDown={changeFocus('playback:playercontrols')}>Shuffle Next</NextTrackButton>
        <PlayerControls menuid='playback:playercontrols' shuffle={shuffle} focused={isFocused('playback:playercontrols')}
          defaultFocus={'playback:playercontrols:pause'} onFarRight={changeFocus('shuffleNextTrack')} onDown={onDown}/>
      </div>
    </div>
  </div>
)

export default Space(TrackInfo)
