import React from 'react'
import cx from 'classnames'
import css from './Linking.scss'

const Linking = ({user_code, verification_uri}) => (
  <div className={cx(css.Linking, 'Page')}>
    <label className='text-info'>To link your Samsung Device to Amazon Music please go to</label>
    {verification_uri &&
      <a href={verification_uri} className='link' target='_blank'>{verification_uri}</a>
    }
    <label className='text-info'>and enter the code:</label>
    <div className='code'>
      <label>{user_code}</label>
    </div>
  </div>
)
export default Linking
