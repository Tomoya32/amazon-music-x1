import React from 'react'
import './TrackInfo.css'
const TrackInfo = ({title, artist, album, image}) => (
  <div className='TrackInfo'>
    {image && (<img src={image.uri} alt={title} />)}
    <h1>{title}</h1>
    {artist && artist.name && (<h2>{artist.name}</h2>)}
    {album && album.name && (<h3>{album.name}</h3>)}
  </div>
)

export default TrackInfo