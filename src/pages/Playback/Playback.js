import React from 'react'
import TrackInfo from '../../components/TrackInfo'
import './Playback.css'
import Space from '../../lib/reactv-redux/SpaceRedux'
import ProgressBar from '../../components/ProgressBar'

const Playback = ({isFocused, menuid, title, artist, album, image, onNext, onShuffleNext, ...props}) => (
  <div className='Playback Page' style={image ? {backgroundImage: `url(${image.uri})`, backgroundSize: 'cover' } : { backgroundSize: 'cover' }}>
    <TrackInfo title={title} artist={artist} album={album} image={image} onNext={onNext} onShuffleNext={onShuffleNext} focused={isFocused('trackInfo')} menuid='track-info-button' onFocusItem={'playback:playercontrols'} />
    <div style={{display: 'block'}}>
      <ProgressBar />
    </div>
  </div>
)

export default Space(Playback)
