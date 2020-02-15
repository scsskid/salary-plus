export default class SPComponent {
  set title(title) {
    console.log('setting this.titleValue to', title)
    this.titleValue = title
    console.log('rerender component', this)

    this.render()
  }

  get title() {
    console.log('getting titleValue')
    return this.titleValue
  }

  init(container) {
    this.container = container
    this.titleValue = this.container.dataset.title
    this.render()
  }

  render() {
    this.container.innerHTML = SPComponent.markup(this)
  }

  static markup({ title }) {
    return `
      <h1>${title}</h1>
    `
  }

  constructor(container) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      this.ref = Math.random()
      SPComponent.refs[this.ref] = this
      container.dataset.ref = this.ref
      this.init(container)
    } else {
      // If this element has already been instantiated, use the existing reference.
      return SPComponent.refs[container.dataset.ref]
    }
  }
}

SPComponent.refs = {}
