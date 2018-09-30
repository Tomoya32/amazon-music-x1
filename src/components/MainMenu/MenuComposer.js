import React from 'react'

const MenuComposer = (MenuComponent, InnerComponent) => {
  class MenuWrapper extends React.Component {
    render() {
      const {changeFocus, isFocused, term, results, onLetter, onSubmit, updateMenu, onFocusItem, topnav, history, entryFocus } = this.props;
      return (
        <div>
          <MenuComponent menuid='topnav' mid='topnav' focused={isFocused('topnav')} topnav={topnav} onEnter={(value) => { history.push(value.path) }}
            onDown={changeFocus(entryFocus)} onRight={() => updateMenu('topnav', {index: 0})} onLeft={() => updateMenu('topnav', {index: topnav.length - 1 })}/>
          <InnerComponent {...this.props}/>
        </div>
      )
    }
  }

  return MenuWrapper
}

export default MenuComposer
