import React from 'react'
import TrackInfo from '../../components/TrackInfo'
import './Playback.css'
import Space from '../../lib/reactv-redux/SpaceRedux'

const Playback = ({isFocused, menuid, title, artist, album, image, onNext, onShuffleNext, ...props}) => (
  <div className='Playback Page' style={{backgroundImage: `url(${image.uri})`, backgroundSize: 'cover' }}>
    <TrackInfo title={title} artist={artist} album={album} image={image} onNext={onNext} onShuffleNext={onShuffleNext} focused={isFocused('trackInfo')} menuid='track-info-button' onFocusItem={'nextTrack'} />
  </div>
)

export default Space(Playback)