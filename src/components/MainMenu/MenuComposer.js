import React from 'react'

const MenuComposer = (MenuComponent, InnerComponent) => {
  class MenuWrapper extends React.Component {
    render() {
      const {changeFocus, isFocused, term, results, onLetter, onSubmit, updateMenu, onFocusItem, topnav, entryFocus } = this.props;
      return (
        <div>
          <MenuComponent menuid='topnav' mid='topnav' focused={isFocused('topnav')} topnav={topnav}
            onDown={changeFocus(entryFocus)} onRight={() => updateMenu('topnav', {index: 0})} updateMenu={updateMenu}/>
          <InnerComponent {...this.props}/>
        </div>
      )
    }
  }

  return MenuWrapper
}

export default MenuComposer
