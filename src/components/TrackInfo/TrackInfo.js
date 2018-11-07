import React from 'react'
import Space from '../../lib/reactv-redux/SpaceRedux'
import PlayerControls from '../PlayerControls'
import style from './TrackInfo.scss'

const TrackInfo = ({title, artist, album, image, shuffle, onNext, onShuffleNext, isFocused, changeFocus, onDown, trackRating}) => {
  const artistName = artist && artist.name
  const albumName = album && album.name
  const trackDeetsSubtitle = (artistName && albumName) ? (artistName + ' • ' + albumName) : (artistName || albumName)

  return (
    <div className={style.TrackInfo}>
      {image && (<img src={image.uri} alt={title} />)}
      <div className='TrackDeets'>
        <div className='titleSection'>
          <label className='title'>{title}</label>
          {(artistName || albumName) && (
            <label className='subtitle'>{trackDeetsSubtitle}</label>
          )}
        </div>
        <PlayerControls
          menuid='playback:playercontrols'
          focused={isFocused('playback:playercontrols')}
          onFocusItem={'playback:playercontrols:pause'}
          onFarRight={changeFocus('shuffleNextTrack')}
          shuffle={shuffle}
          onDown={onDown}
          trackRating={trackRating}
        />
      </div>
    </div>
  )
}

export default Space(TrackInfo)
