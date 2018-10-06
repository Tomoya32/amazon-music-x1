import React from 'react'
import TrackInfo from '../../components/TrackInfo'
import './Playback.css'
import Space from '../../lib/reactv-redux/SpaceRedux'

const Playback = ({isFocused, ...props}) => (
  <div className='Playback Page' style={props.image ? {backgroundImage: `url(${props.image.uri})`, backgroundSize: 'cover' } : { backgroundSize: 'cover' }}>
    <TrackInfo {...props}  focused={isFocused('trackInfo')} menuid={'track-info-button'} onFocusItem={'nextTrack'} />
  </div>
)

export default Space(Playback)
