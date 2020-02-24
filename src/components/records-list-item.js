export default class RecordsListItem {
  set state(state) {
    this.stateValue = state
    console.log('Setting state of SUb Comp')
    this.render()
  }

  get state() {
    console.log('Getting state of SUb Comp')
    return this.stateValue
  }

  init(container) {
    this.container = container
    this.render()
  }

  render() {
    this.container.innerHTML = RecordsListItem.markup(this)
  }

  static markup({ state }) {
    console.log(state)

    return `
      <p>Hello from List Item</p>
      <p>State: ${state}</p>
    `
  }

  constructor(container) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      console.log('constructur called of subComp', container)
      this.ref = Math.random()
      RecordsListItem.refs[this.ref] = this
      container.dataset.ref = this.ref
      this.init(container)
    } else {
      // If this element has already been instantiated, use the existing reference.
      return RecordsListItem.refs[container.dataset.ref]
    }
  }
}

RecordsListItem.refs = {}
