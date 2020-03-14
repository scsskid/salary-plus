import BaseComponent from './BaseComponent.js'
import { events } from './../utils.js'
export default class MainNav extends BaseComponent {
  render() {
    this.container.innerHTML = `
      <ul class="main-nav-menu" data-nav-menu>
        <li><a href="${window.location.origin}/">Overview</a></li>
        <li><a href="${window.location.origin}/records">List</a></li>
        <li><a href="${window.location.origin}/records/new">Add</a></li>
        <li><a href="${window.location.origin}/settings">Settings</a></li>
        <li><a href="${window.location.origin}/debug">Debug</a></li>
      </ul>
    `

    this.container.querySelector('[data-nav-menu]').addEventListener('click', event => {
      event.preventDefault()
      // overengineered? but what about protocols
      if (event.target.href) {
        const url = new URL(event.target.href)
        // console.log(url.pathname, event.target.href)

        // window.history.pushState({}, '', url.pathname)

        // ! refactor Utils.route(path) || route()
        // event.target.dispatchEvent(new CustomEvent('navigate', { bubbles: true, detail: { pathname: url.pathname } }))
        events.dispatch('navigate', { pathname: url.pathname })
      }
    })
  }

  static markup(record) {
    return `empty markup`
  }

  addEventListeners() {}

  constructor(tag, state) {
    super(tag, state)
  }
}
