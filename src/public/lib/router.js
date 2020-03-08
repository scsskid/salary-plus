class Router {
  constructor(routes) {
    this.routes = routes
    this._loadInitialRoute()
  }

  loadRoute(urlSegments) {
    // Attempt to match the URL to a route.
    const matchedRoute = this._matchUrlToRoute(urlSegments)

    if (matchedRoute.module != undefined) {
      console.log('👍FOUND. Module:', matchedRoute)
    } else {
      console.log('👎NOT FOUND')
    }

    window.dispatchEvent(
      new CustomEvent('routeLoad', {
        detail: {
          route: matchedRoute
        }
      })
    )
  }

  _matchUrlToRoute(urlSegments) {
    let routeParams = {}

    // todo: deal with possible trailing slash see below trimTrailingSlash() fn
    const matchedRoute = this.routes.find(route => {
      const routePathSegments = route.path.split('/').slice(1)

      // bail early if segement.lengths dont match
      if (routePathSegments.length != urlSegments.length) {
        return false
      }

      // return true if all segements of url path and route path match or
      // or the route path segments first char starts with a ':'
      const match = routePathSegments.every((routePathSegement, i) => {
        return routePathSegement == urlSegments[i] || routePathSegement[0] == ':'
      })

      if (match) {
        routePathSegments.forEach((routePathSegement, i) => {
          if (routePathSegement[0] == ':') {
            const propName = routePathSegement.slice(1)
            routeParams[propName] = decodeURIComponent(urlSegments[i])
          }
        })
      }

      return match // if callback == true find() returns the route
    })

    return { ...matchedRoute, params: routeParams }
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
