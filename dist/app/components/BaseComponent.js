export default class BaseComponent {
  set state(state) {
    this.stateValue = state || {}
    this.render() // ? Too much?
  }

  get state() {
    return this.stateValue
  }

  init(tag, state) {
    console.log(tag, state)

    this.container = document.createElement(tag)
    this.state = state
    this.refs = {}
  }
  render() {
    console.error('no render specified')
  }
  constructor(tag, state) {
    this.init(tag, state)
  }
}
