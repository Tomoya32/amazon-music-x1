import React from 'react'
import './TrackInfo.css'
import Space from '../../lib/reactv-redux/SpaceRedux'
import PlayerControls from '../PlayerControls'

const TrackInfo = ({ title, artist, album, image, shuffle, onNext, onShuffleNext, isFocused, changeFocus, onDown, trackRating}) => (
  <div className='TrackInfo'>
    {image && (<img src={image.uri} alt={title} />)}
    <div className={'TrackDeets'}>
      <div>
        <h1>{title}</h1>
        {artist && artist.name && (<h2>{artist.name}</h2>)}
        {album && album.name && (<h3>{album.name}</h3>)}
        <PlayerControls menuid='playback:playercontrols' shuffle={shuffle} focused={isFocused('playback:playercontrols')}
          defaultFocus={'playback:playercontrols:pause'} onFarRight={changeFocus('shuffleNextTrack')} onDown={onDown} trackRating={trackRating}/>
      </div>
    </div>
  </div>
)

export default Space(TrackInfo)
