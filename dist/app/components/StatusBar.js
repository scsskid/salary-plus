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

    events.on('proxyStateChanged', this.checkPropChange.bind(this))
  }

  render() {
    const countRecords = proxyState.records.length

    this.container.innerHTML = `${countRecords} Records (State)`
  }

  checkPropChange(propName) {
    if (propName == 'records') {
      this.render()
    }
  }

  constructor(container, state) {
    super(container, state)
  }
}

export default StatusBar
