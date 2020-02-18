export default class RecordsListItem {
  set title(title) {
    this.render()
  }

  get title() {
    return this.titleValue
  }

  init(container) {
    this.container = container
    this.render()
  }

  render() {
    this.container.innerHTML = Generic.markup(this)
  }

  static markup({ title }) {
    return `
      <p>Hello from List Item</p>
    `
  }

  constructor(container) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      console.log(container)
      this.ref = Math.random()
      Generic.refs[this.ref] = this
      container.dataset.ref = this.ref
      this.init(container)
    } else {
      // If this element has already been instantiated, use the existing reference.
      return Generic.refs[container.dataset.ref]
    }
  }
}

RecordsListItem.refs = {}
