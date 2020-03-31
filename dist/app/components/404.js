import BaseComponent from './BaseComponent.js'

class Error404 extends BaseComponent {
  render() {
    this.container.innerHTML = `
    ${window.location.pathname} <br>Not Found 💥
    `
  }

  constructor(tag, state) {
    super(tag, state)
  }
}

export default Error404
