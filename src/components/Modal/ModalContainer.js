import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { connect } from 'react-redux'
import cx from 'classnames'
import './Modal.css'
import {Buttonizer} from '../../lib/reactv-navigation'
import Space from '../../lib/reactv-redux/SpaceRedux'
const mapStateToProps = (state) => ({
  showModal: state.modal.showModal,
  nodes: state.music.nodes,
  errorMsg: state.music.errorMsg
})

let CloseModalButton = Buttonizer(
    ({focused}) => (
      <div className={cx('CloseModalButton', { focused })}>OK</div>
    )
)

let ActionModalButton = Buttonizer(
  ({focused, label}) => (
    <div className={cx('ActionModalButton', { focused })}>{label}</div>
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
    const { className, menuid, focused, onEnter, showModal, errorMsg, isFocused, changeFocus } = this.props;
    if ( errorMsg && errorMsg.generalErrorReports && errorMsg.generalErrorReports._obj0 ) {
      return (
        <ReactModal
          isOpen={showModal}
          contentLabel="Minimal Modal Example">
          <div className="music-modal">
            <h1>{errorMsg.generalErrorReports._obj0.brief}</h1>
            <p>{errorMsg.generalErrorReports._obj0.explanation}</p>
            <ActionModalButton
              onEnter={() => window.location = errorMsg.generalErrorReports._obj0.options[0].uri}
              label={errorMsg.generalErrorReports._obj0.options[0].label}
              mid='action'
              focused={isFocused("action")}
              onDown={changeFocus("close-modal")}
            />
            <ActionModalButton
              mid="close-modal"
              label={errorMsg.generalErrorReports._obj0.options[1].label}
              onEnter={() => { this.handleCloseModal() }}
              onUp={changeFocus("action")}
              focused={isFocused("close-modal")}
            />
          </div>
        </ReactModal>
      );
    }
    return (
      <ReactModal
        isOpen={showModal}
        contentLabel="Minimal Modal Example">
        <div className="music-modal">
          <h1>Amazon Music | Unlimited</h1>
          <p>Listen to this music and tens of millions more songs with Amazon Music Unlimited. Start a 30-day free trial at amzn.com/stvamu</p>
          <CloseModalButton mid="close-modal" onEnter={() => { this.handleCloseModal() }} focused={focused} />
        </div>
      </ReactModal>
    );
  }
}

export default connect(mapStateToProps)(Space(Modal))
