import { events } from '../utils.js'
import Store from '../store.js'

const store = new Store()
const now = new Date()
now.setHours(0, 0, 0, 0)

let defaultState = { ...store.getAll(), inputDate: now }

const proxyState = new Proxy(typeof defaultState !== 'undefined' ? defaultState : {}, {
  set(obj, prop, value) {
    // const oldState = { ...obj }
    obj[prop] = value
    events.publish('proxyStateChanged', prop) // currently only  statusBar is subscribed
    events.publish(`proxy ${prop} change`, { value })
    // console.log('--- PROXY SET', prop, value)

    return obj
  }
})

export default proxyState
