class Router {
  constructor(routes) {
    // this.routes = [
    //   {
    //     path: '/',
    //     template: '<h1>home</h1>'
    //   },
    //   {
    //     path: '/1-huhu/okay',
    //     template: '<h1>home</h1>'
    //   },
    //   {
    //     path: '/2-yolo',
    //     template: '<h1>yolo</h1>'
    //   },
    //   {
    //     path: '/1-huhu',
    //     template: '<h1>yolo</h1>'
    //   }
    // ]
    this.routes = [
      {
        path: '/1-huhu/okay',
        template: '<h1>home</h1>'
      }
    ]
    this._loadInitialRoute()
  }

  loadRoute(urlSegments) {
    // Attempt to match the URL to a route.
    const matchedRoute = this._matchUrlToRoute(urlSegments)

    // console.log(urlSegments)
    console.log(matchedRoute)

    // console.log(matchedRoute.path)
  }

  _matchUrlToRoute(urlSegments) {
    // urlSegments = urlSegments.split('/').slice(1)
    // console.log(urlSegments)

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
    console.log(matchedRoute)

    return matchedRoute
  }

  _loadInitialRoute() {
    console.log(window.location.pathname)

    // todo: test pathname not empty
    const pathnameSplit = window.location.pathname.toLowerCase().split('/')
    const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : ''
    console.log(pathnameSplit, pathnameSplit.length, pathSegments)

    this.loadRoute(pathSegments)
  }
}

export default Router
