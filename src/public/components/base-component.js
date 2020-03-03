export default class BaseComponent {
  set state(state) {
    this.stateValue = state
    this.render() // ? Too much?
  }

  get state() {
    return this.stateValue
  }

  init(container, state) {
    this.container = container
    this.state = state
  }
  render() {
    console.error('no render specified')
  }
  constructor(container, state) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      // console.log('constructur called of subComp', container)
      this.ref = Math.random()
      BaseComponent.refs[this.ref] = this
      container.dataset.ref = this.ref
      this.init(container, state)
    } else {
      // If this element has already been instantiated, use the existing reference.
      return BaseComponent.refs[container.dataset.ref]
    }
  }
}

BaseComponent.refs = {}
