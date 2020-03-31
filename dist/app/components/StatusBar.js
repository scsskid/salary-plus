import BaseComponent from './BaseComponent.js'
import Utils, { events } from '../utils.js'
import proxyState from '../lib/Proxy.js'

class StatusBar extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state

    events.on('proxyStateChanged', this.render.bind(this))
    this.addEventListeners()
  }

  render() {
    const countRecords = typeof proxyState.records !== 'undefined' ? proxyState.records.length : 0
    const mainViewComponent = proxyState.mainViewComponent
    const inputDate = proxyState.inputDate || new Date()
    this.container.style.marginTop = '-4rem'
    this.container.innerHTML = `
      <small style="line-height: 1.2; display: block; text-align: right">
        Records: ${countRecords} <br>
        MainViewComponent: ${mainViewComponent}<br>
        inputDate: ${Utils.formatDate.rfc3339(inputDate)}<br>
        <span><a data-href="/debug" href="/debug">Debug</a></span>
        
        </small>`
  }

  addEventListeners() {
    this.container.addEventListener('click', event => {
      console.log('handler start')

      console.log(this.container)

      event.preventDefault()
      if (event.target.href) {
        const url = new URL(event.target.href)
        // ! refactor Utils.route(path) || route()
        events.publish('navigate', { pathname: url.pathname })
      }
    })
  }
  // checkPropChange(propName) {
  //   if (propName == 'records' || propName == 'mainViewComponent') {
  //     this.render()
  //   }
  // }

  constructor(container, state) {
    super(container, state)
  }
}

export default StatusBar
