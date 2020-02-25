export default class Nav {
  set state(state) {
    this.stateValue = state
    this.render()
    // console.log('setting state')
  }

  get state() {
    // console.log('getting state')
    return this.stateValue
  }

  init(container) {
    this.container = container
    // this.state = state

    this.render()
  }

  render() {
    this.container.innerHTML = `
      <ul class="main-nav-menu" data-nav-menu>
        <li><a data-nav-target="home" href="/">Home</a></li>
        <li><a data-nav-target="records" href="/records">Records List</a></li>
        <li><a data-nav-target="settings" href="/settings">Settings</a></li>
      </ul>
    `

    this.container.querySelector('[data-nav-menu]').addEventListener('click', event => {
      event.preventDefault()
      // console.log(event.target)
      const navigate = new CustomEvent('navigate', { bubbles: true })
      event.target.dispatchEvent(navigate)
    })
  }

  static markup(record) {
    return `empty markup`
  }

  addEventListeners() {}

  constructor(container) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      // console.log('constructur called of subComp', container)
      this.ref = Math.random()
      Nav.refs[this.ref] = this
      container.dataset.ref = this.ref
      this.init(container)
    } else {
      // If this element has already been instantiated, use the existing reference.
      return Nav.refs[container.dataset.ref]
    }
  }
}

Nav.refs = {}
