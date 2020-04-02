import BaseComponent from './BaseComponent.js'
import { dispatchEvent } from './../utils.js'
class Settings extends BaseComponent {
  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
  }
  render() {
    this.container.innerHTML = `🤔 Not yet implemented`
  }

  constructor(container) {
    super(container)
  }
}

export default Settings
