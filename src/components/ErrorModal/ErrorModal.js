import React from 'react'
import './ErrorModal.css'
import {connect} from 'react-redux'
import cx from 'classnames'

const mapStateToProps = ({errorModal}) => ({ ...errorModal })

const ErrorModal = ({title, description, visible}) => (
  <div className={cx('ErrorModal', {visible})}>
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
)

export default connect(mapStateToProps)(ErrorModal)