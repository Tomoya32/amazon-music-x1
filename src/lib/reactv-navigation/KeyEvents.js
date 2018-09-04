import keymap from './KeyMaps'

export default class KeyEvents {
  constructor () {
    this.handlers = {}
    document.addEventListener('keydown', (e) => {
      const name = keymap(e.keyCode)
      if (!name) return
      this.publish(name)
      if (this.handlers.hasOwnProperty(name)) {
        e.preventDefault()
        e.stopPropagation()
      }
    })

    document.addEventListener('keyup', (e) => {
      let name = keymap(e.keyCode)
      if (!name) return
      name += 'Up'
      this.publish(name)
      if (this.handlers.hasOwnProperty(name)) {
        e.preventDefault()
        e.stopPropagation()
      }
    })
  }

  /**
   * Simple pub sub model for back handling
   * @param {String} key - event to subscribe to
   * @param {function} func  - function to subscribe to back events.
   * @returns {function} - unsubscribe function.
   *
   * @example
   *
   * import Navigation from 'reactv-navigation'
   * const Nav = new KeyEvents();
   * let binding = Nav.subscribeToKey('Back', () => {
     *  console.info('back called');
     *  binding.unsubscribe();
     * })
   *
   *
   */
  subscribeTo (key, func) {
    // Find or create Queue
    if (!this.handlers.hasOwnProperty(key)) { this.handlers[key] = [] }
    let index = this.handlers[key].push(func) - 1
    var that = this
    return {
      index: index,
      unsubscribe: function () {
        delete that.handlers[key][index]
      }
    }
  }

  /**
   * Publish key event
   * @param {String} key - event to be published
   * @returns {Boolean} true or false whether something was able to handle this.
   */
  publish (evt) {
    if (!evt || !this.handlers.hasOwnProperty(evt)) {
      return false
    }
    // Create a copy so that we don't get new bindings during the event
    // being published.
    const handlers = this.handlers[evt].slice(0)

    // Do this on next tick to prevent some issues with bindings happening during event.
    setTimeout(() => {
      handlers.forEach(handler => handler())
    }, 0)
  }
}
