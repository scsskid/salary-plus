import { events } from '../utils.js'
import { Store } from '../store.js'

let defaultState = { ...Store.getAll(), inputDate: new Date() }

const proxyState = new Proxy(typeof defaultState !== 'undefined' ? defaultState : {}, {
  set(obj, prop, value) {
    // const oldState = { ...obj }
    obj[prop] = value
    events.publish('proxyStateChanged', prop) // currently only  statusBar is subscribed
    console.warn('--- PROXY SET', prop, value)

    return obj
  }
})

export default proxyState
