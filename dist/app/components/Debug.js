import BaseComponent from './BaseComponent.js'
import { dispatchEvent } from './../utils.js'

class Debug extends BaseComponent {
  render() {
    this.container.innerHTML = ''

    this.container.insertAdjacentHTML('beforeend', `<p><button data-save-sample-data>Insert SampleData</button></p>`)
    this.container.insertAdjacentHTML('beforeend', `<p><button data-clear-storage>Clear localStorage</button></p>`)

    this.addEventListeners()

    dispatchEvent('render', this.container, { title: 'Debug' })
  }

  addEventListeners() {
    this.container.addEventListener('click', event => {
      event.preventDefault()

      if ('saveSampleData' in event.target.dataset) {
        dispatchEvent('save-sample-data', this.container)
      }
      if ('clearStorage' in event.target.dataset) {
        dispatchEvent('clear-storage', this.container)
      }
    })
  }

  constructor(container) {
    super(container)
  }
}

export default Debug
