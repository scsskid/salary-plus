import { events } from '../utils.js'
import { Store } from '../store.js'

let defaultState = Store.getAll()

const proxyState = new Proxy(typeof defaultState !== 'undefined' ? defaultState : {}, {
  set(obj, prop, value) {
    // const oldState = { ...obj }
    obj[prop] = value
    events.publish('proxyStateChanged', prop)
    return obj
  }
})

export default proxyState
