import BaseComponent from './base-component.js'
export default class Nav extends BaseComponent {
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
      // overengineered? but what about protocols
      if (event.target.href) {
        const url = new URL(event.target.href)
        // console.log(url.pathname, event.target.href)

        // window.history.pushState({}, '', url.pathname)
        event.target.dispatchEvent(new CustomEvent('navigate', { bubbles: true, detail: { pathname: url.pathname } }))
      }
    })
  }

  static markup(record) {
    return `empty markup`
  }

  addEventListeners() {}

  constructor(container, state) {
    super(container, state)
  }
}
