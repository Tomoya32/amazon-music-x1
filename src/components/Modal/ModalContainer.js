import React, { Component } from 'react'
import ReactModal from 'react-modal'
import cx from 'classnames'
import './Modal.css'
import {Buttonizer} from '../../lib/reactv-navigation'

let CloseModalButton = Buttonizer(
    ({focused}) => (
      <div className={cx('CloseModalButton', {focused})}>OK</div>
    )
)

class Modal extends Component {
  constructor() {
    super();
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleCloseModal () {
    this.props.onEnter()
  }

  componentWillMount() {
    ReactModal.setAppElement('body');
  }

  render () {
    const { className, menuid, focused, onEnter, showModal } = this.props;
    return (
      <ReactModal
         isOpen={showModal}
         contentLabel="Minimal Modal Example">
         <div className="music-modal">
           <h1>Amazon Music | Unlimited</h1>
           <p>Listen to this music and tens of millions more songs with Amazon Music Unlimited. Start a 30-day free trial at amzn.com/stvamu</p>
           <CloseModalButton mid="close-modal" onEnter={() => { this.handleCloseModal() }} focused={focused}/>
         </div>
      </ReactModal>
    );
  }
}

export default Modal
