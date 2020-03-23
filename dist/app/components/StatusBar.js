import BaseComponent from './BaseComponent.js'
import Utils, { events } from '../utils.js'
import proxyState from '../lib/Proxy.js'

class StatusBar extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
    this.content = {
      title: 'Settings'
    }

    events.on('proxyStateChanged', this.render.bind(this))
  }

  render() {
    const countRecords = proxyState.records.length
    const mainViewComponent = proxyState.mainViewComponent
    const inputDate = proxyState.inputDate || new Date()
    this.container.innerHTML = `
      <small style="line-height: 1.2; display: block; text-align: right">
        Records: ${countRecords} <br>
        MainViewComponent: ${mainViewComponent}<br>
        inputDate: ${Utils.formatDate.rfc3339(inputDate)}
        
        </small>`
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
