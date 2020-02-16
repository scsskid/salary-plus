export default class Generic {
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
    this.container.innerHTML = Generic.markup(this)
  }

  static markup({ title }) {
    return `
      <p>Hello from Generic Component</p>
      <h1>title: ${title}</h1>
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

Generic.refs = {}
