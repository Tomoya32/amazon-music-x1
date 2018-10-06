import React, { Component } from 'react'
import ReactModal from 'react-modal'

class MusicModal extends Component {
  constructor() {
    super();
    this.state = {
      showModal: true
    }
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal () {
    this.setState({ showModal: true });
  }

  handleCloseModal () {
    this.setState({ showModal: false });
  }

  render () {
    return (
      <div>
        <button onClick={this.handleOpenModal}>Try Amazon Music Unlimited</button>
        <ReactModal
           isOpen={this.state.showModal}
           contentLabel="Minimal Modal Example">
           <div className="music-modal">
             <h1>Amazon Music | Unlimited</h1>
             <p>Listen to this music and tens of millions more songs with Amazon Music Unlimited. Start a 30-day free trial at amzn.com/stvamu</p>
             <button onClick={this.handleCloseModal}>OK</button>
           </div>
        </ReactModal>
      </div>
    );
  }
}

export default MusicModal
