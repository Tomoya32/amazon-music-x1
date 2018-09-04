import React from 'react'
import NodeTitle from '../../components/NodeTitle'

const Node = ({itemLabel, subtitle, image}) => (
  <div className='Node'>
    <NodeTitle itemLabel={itemLabel} subtitle={subtitle} image={image} />
  </div>
)

export default Node