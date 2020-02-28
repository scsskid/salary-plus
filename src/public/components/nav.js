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
        <li><a data-nav-target="home" href="${window.location.origin}/">Home</a></li>
        <li><a data-nav-target="records" href="${window.location.origin}/records">Records List</a></li>
        <li><a data-nav-target="settings" href="${window.location.origin}/settings">Settings</a></li>
      </ul>
    `

    this.container.querySelector('[data-nav-menu]').addEventListener('click', event => {
      event.preventDefault()
      window.history.pushState({}, '', '/' + event.target.dataset.navTarget)
      event.target.dispatchEvent(new CustomEvent('navigate', { bubbles: true }))
    })

    window.onpopstate = function(event) {
      console.log(`location: ${window.location}, state: ${JSON.stringify(event.state)}`)
    }
  }

  static markup(record) {
    return `empty markup`
  }

  addEventListeners() {}

  constructor(container) {
    this.init(container)
  }
}
