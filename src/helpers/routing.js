const routes = {
  ui: {
    home: '/',
    services: {
      serviceHome: '/services/:serviceId',
      updatesList: '/services/:serviceId/updates',
    }
  },
  api: { // all prefixed with /api
    bootstrap: '/bootstrap',
    services: {
      getDetails: '/services/:serviceId',
      getUpdates: '/services/:serviceId/updates'
    }
  }
}

export const routesUI = routes.ui
export const routesAPI= routes.api

const Routing = {

  generate(path, params) {
    let url = path

    if (params) {
      Object.keys(params).map((key, index) => {
        let value = params[key];
        url = url.replace(`:${key}`, value)
      });
    }

    return url;
  },
}

export default Routing;
