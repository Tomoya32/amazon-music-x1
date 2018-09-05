import React from 'react'
import TrackInfo from '../../components/TrackInfo'
import './Playback.css'

const Playback = ({...props}) => (
  <div className='Playback Page' style={{backgroundImage: `url(${props.image.uri})`, backgroundSize: 'cover' }}>
    <TrackInfo {...props} />
  </div>
)

export default Playback