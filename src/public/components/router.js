class Router {
  constructor(routes) {
    this.routes = routes
    this._loadInitialRoute()
  }

  loadRoute(urlSegments) {
    // Attempt to match the URL to a route.
    console.log(urlSegments)
    const matchedRoute = this._matchUrlToRoute(urlSegments)
    console.log('matchedRoute: ', matchedRoute)
    const url = `/${urlSegments.join('/')}`

    let moduleToLoad
    // Render Component or Fire Event to app
    if (matchedRoute != undefined) {
      moduleToLoad = matchedRoute.module
      console.log('👍ROUTE, FOUND. Module:', matchedRoute.module)
    } else {
      moduleToLoad = 'Error404'
      console.log('👎ROUTE NOT FOUND')
    }

    console.log('module to load', moduleToLoad)

    window.dispatchEvent(new CustomEvent('routeLoad', { detail: { module: moduleToLoad } }))
  }

  _matchUrlToRoute(urlSegments) {
    // todo: deal with possible trailing slash see below trimTrailingSlash() fn
    // Try and match the URL to a route (wip)
    const matchedRoute = this.routes.find(route => {
      const routePathSegments = route.path.split('/').slice(1)

      // bail early if segement.lengths dont match
      if (routePathSegments.length != urlSegments.length) {
        return false
      }

      // return true if all segements of url path and route path match
      const doAllSegementsMatch = routePathSegments.every((routePathSegement, i) => {
        return routePathSegement == urlSegments[i]
      })

      return doAllSegementsMatch // if callback == true find() returns the route
    })

    return matchedRoute
  }

  _loadInitialRoute() {
    // todo: test pathname not empty
    const pathnameSplit = window.location.pathname.toLowerCase().split('/')
    const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : ''

    this.loadRoute(pathSegments)
  }
}

export default Router

// todo: understand and implement
// src: https://github.com/jorgebucaran/hyperapp-router/blob/master/src/parseRoute.js
function trimTrailingSlash(url) {
  for (var len = url.length; '/' === url[--len]; );
  return url.slice(0, len + 1)
}
