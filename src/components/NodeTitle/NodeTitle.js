import React from 'react'
import './NodeTitle.css'
import PropTypes from 'prop-types'
const NodeTitle = ({itemLabel, image, subtitle}) => (
  <div className='NodeTitle'>
    <h1>{itemLabel}</h1>
    {subtitle &&  (<h2>{subtitle}</h2>)}
    {image  ? <img src={image.uri} height={300} width={300} /> : null }
  </div>
)


NodeTitle.propTypes = {
  itemLabel: PropTypes.string.isRequired,
  image: PropTypes.object,
  subtitle: PropTypes.string
}

export default NodeTitle