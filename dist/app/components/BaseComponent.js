export default class BaseComponent {
  set state(state) {
    this.stateValue = state || {}
    this.render() // ? Too much?
  }

  get state() {
    return this.stateValue
  }

  init(container, state) {
    this.container = container
    this.state = state
    this.refs = {}
  }
  render() {
    console.error('no render specified')
  }
  constructor(container, state) {
    this.init(container, state)
  }
}
