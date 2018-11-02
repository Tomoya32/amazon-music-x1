import React from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import { Buttonizer } from '../../lib/reactv-navigation'
import Cookie from 'js-cookie'

const mapStateToProps = ({ modal }) => ({
  fading: modal.fading
})

let UnlinkButton = Buttonizer(
  ({ focused }) => (
    <div className={cx('UnlinkBTN', { focused })}>Unlink</div>
  )
)

const MenuComposer = (MenuComponent, InnerComponent) => {
  class MenuWrapper extends React.Component {
    handleUnlinkButton() {
      Cookie.remove('amzn_music_auth')
      window.location.reload()
    }
    render() {
      const {changeFocus, isFocused, term, results, onLetter, onSubmit, updateMenu, onFocusItem, topnav, entryFocus } = this.props;
      return (
        <div>
          <MenuComponent
            menuid='topnav'
            mid='topnav'
            focused={isFocused('topnav')}
            topnav={topnav}
            onDown={this.props.fading ? changeFocus('unlink') : changeFocus(entryFocus)}
            onRight={() => updateMenu('topnav', { index: 0 })}
            fading={this.props.fading}
            updateMenu={updateMenu}
          />
          {this.props.fading && <div className={cx('Unlink', 'faded')}>
            <UnlinkButton
              mid={'unlink'}
              menuid={'unlink'}
              focused={isFocused('unlink')}
              onUp={changeFocus('topnav')}
              onEnter={() => { this.handleUnlinkButton() }}
            />
          </div>}
          <InnerComponent {...this.props} />
        </div>
      )
    }
  }

  return connect(mapStateToProps)(MenuWrapper)
}

export default (MenuComposer)
