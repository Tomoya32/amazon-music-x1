import React from 'react'
import TrackInfo from '../../components/TrackInfo'
import './Playback.css'
import Space from '../../lib/reactv-redux/SpaceRedux'
import ProgressBar from '../../components/ProgressBar'
import Buttonizer from '../../lib/reactv-navigation/components/Buttonizer'
import ReactModal from 'react-modal'

const ScrubbableProgressBar = Buttonizer(({focused}) => (
  <ProgressBar focused={focused} />
))

const Playback = ({isFocused, menuid, title, artist, album, shuffle, image, onNext, onShuffleNext, changeFocus, seek, trackRating, showModal, modalMessage, ...props}) => (
  <div className='Playback Page'>
    <div className='Playback-background' style={image ? {backgroundImage: `url(${image.uri})` } : { backgroundSize: 'cover' }} />
    <div id="TrackInfo">
      <TrackInfo
        title={title}
        artist={artist}
        shuffle={shuffle}
        album={album}
        image={image}
        onNext={onNext}
        onShuffleNext={onShuffleNext}
        focused={isFocused('trackInfo')}
        menuid='track-info-button'
        onFocusItem={'playback:playercontrols'}
        onDown={changeFocus('progressbar')}
        trackRating={trackRating}/>
    </div>
    <div id="ProgressContainer" style={{display: 'block'}}>
      <ScrubbableProgressBar
        onLeft={() => { seek(-1) }}
        onRight={() => { seek(+1) }}
        onUp={changeFocus('trackInfo')}
        focused={isFocused('progressbar')}
        mid='progressbar'/>
    </div>
    <ReactModal className='PlaybackResponse' isOpen={showModal}>
      <label>{modalMessage}</label>
    </ReactModal>
  </div>
)

export default Space(Playback)
