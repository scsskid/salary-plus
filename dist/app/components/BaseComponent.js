export default class BaseComponent {
  set state(state) {
    this.stateValue = state || {}
    this.render()
  }

  get state() {
    return this.stateValue
  }

  init(tag, state) {
    this.container = document.createElement(tag)
    this.state = state
  }
  render() {
    console.error('no render specified')
  }
  constructor(tag, state) {
    this.init(tag, state)
  }
}
