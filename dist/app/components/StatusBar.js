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
    const mainViewComponent = proxyState.mainViewComponent
    this.container.innerHTML = `<small style="line-height: 1.2; display: block; text-align: right">${countRecords} Records (State)<br>MainViewComponent: ${mainViewComponent}</small>`
  }

  checkPropChange(propName) {
    if (propName == 'records' || propName == 'mainViewComponent') {
      this.render()
    }
  }

  constructor(container, state) {
    super(container, state)
  }
}

export default StatusBar
