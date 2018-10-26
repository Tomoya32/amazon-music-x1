import React from 'react'
import TrackInfo from '../../components/TrackInfo'
import './Playback.css'
import Space from '../../lib/reactv-redux/SpaceRedux'
import ProgressBar from '../../components/ProgressBar'
import Scrubbable from '../../components/ProgressBar/Scrubbable'

const ScrubbableProgressBar = Scrubbable(({focused}) => (
  <ProgressBar focused={focused}/>
))

const Playback = ({isFocused, menuid, title, artist, album, image, onNext, onShuffleNext, changeFocus, backward, forward, ...props}) => (
  <div className='Playback Page' style={image ? {backgroundImage: `url(${image.uri})`, backgroundSize: 'cover' } : { backgroundSize: 'cover' }}>
    <TrackInfo title={title} artist={artist} album={album} image={image} onNext={onNext} onShuffleNext={onShuffleNext} focused={isFocused('trackInfo')} menuid='track-info-button' onFocusItem={'playback:playercontrols'} onDown={changeFocus('progressbar')}/>
    <div style={{display: 'block'}}>
      <ScrubbableProgressBar
        onLeft={backward}
        onRight={forward}
        onUp={changeFocus('trackInfo')}
        focused={isFocused('progressbar')}
        menuid='progressbar'/>
    </div>
  </div>
)

export default Space(Playback)
