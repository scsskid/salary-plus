class Toolbar {
  init(container, state) {
    this.container = container
    this.state = state || undefined
    this.appDataPresent = localStorage.hasOwnProperty('appData')
    this.render()
  }

  render() {
    // promise: connect(), resolve: connectedCallback()
    // this.connectedCallback()
    this.container.innerHTML = ''
    const toolbarEl = document.createElement('div')
    this.container.appendChild(toolbarEl)
    if (!this.appDataPresent) {
      toolbarEl.insertAdjacentHTML('afterbegin', `<button data-save-sample-data>Insert SampleData</button>`)
      this.btnSaveSampleData = this.container.querySelector('[data-save-sample-data]')
    }

    this.addEventListeners()
  }

  connectedCallback(container) {
    console.log('after render')
  }

  addEventListeners() {
    if (this.btnSaveSampleData) {
      this.btnSaveSampleData.addEventListener('click', event => {
        this.container.dispatchEvent(new CustomEvent('save-sample-data', { bubbles: true }))
      })
    }
  }

  constructor(container, state) {
    this.init(container, state)
  }
}

export default Toolbar
