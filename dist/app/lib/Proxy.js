import { events } from '../utils.js'
import Store from '../store.js'

const store = new Store()

let defaultState = { ...store.getAll(), inputDate: new Date() }

const proxyState = new Proxy(typeof defaultState !== 'undefined' ? defaultState : {}, {
  set(obj, prop, value) {
    // const oldState = { ...obj }
    obj[prop] = value
    events.publish('proxyStateChanged', prop) // currently only  statusBar is subscribed
    events.publish(`proxy ${prop} change`, { value })
    console.warn('--- PROXY SET', prop, value)

    return obj
  }
})

export default proxyState
