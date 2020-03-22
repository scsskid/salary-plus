import BaseComponent from './BaseComponent.js'
import { events } from '../utils.js'
import proxyState from '../lib/Proxy.js'

class StatusBar extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
    this.content = {
      title: 'Settings'
    }
    console.log(this.state)
    events.on('proxyStateChanged', propName => {
      console.log(propName, proxyState[propName])
      if (propName == 'records') {
        this.render()
      }
    })
  }
  render() {
    console.log('Rendering Status Bar...')

    this.container.innerHTML = ' ...Status Bar'
  }

  constructor(container, state) {
    super(container, state)
  }
}

export default StatusBar
