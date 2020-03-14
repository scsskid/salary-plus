import BaseComponent from './BaseComponent.js'
import { dispatchEvent, events } from './../utils.js'

class Debug extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
    this.content = {
      title: 'Debug'
    }
  }

  render() {
    this.container.innerHTML = ''

    this.container.insertAdjacentHTML('beforeend', `<p><button data-save-sample-data>Insert SampleData</button></p>`)
    this.container.insertAdjacentHTML('beforeend', `<p><button data-clear-storage>Clear localStorage</button></p>`)

    this.addEventListeners()

    // events.publish('update-view-title', { title: Debug.common.title })
  }

  addEventListeners() {
    this.container.addEventListener('click', event => {
      if ('saveSampleData' in event.target.dataset) {
        events.publish('save-sample-data')
      } else if ('clearStorage' in event.target.dataset) {
        events.publish('clear-storage')
      }
    })
  }

  constructor(container) {
    super(container)
  }
}

export default Debug
