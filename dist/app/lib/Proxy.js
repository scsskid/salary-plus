import { events } from '../utils.js'
import { Store } from '../store.js'

let defaultState = Store.getAll()

const proxyState = new Proxy(typeof defaultState !== 'undefined' ? defaultState : {}, {
  set(stateObj, prop, value) {
    // const oldState = { ...stateObj }
    stateObj[prop] = value
    events.publish('proxyStateChanged', prop)

    return stateObj
  }
})

export default proxyState
