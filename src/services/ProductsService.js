import api from "src/helpers/api";
import Routing, { routesAPI } from "src/helpers/routing";

const ProductsService =  {
  findDetailsByServiceId(serviceId)  {
    return api.get(Routing.generate(routesAPI.services.getDetails, {serviceId}))
  },
  findUpdatesRecordsByServiceId(serviceId, params = {})  {
    return api.get(Routing.generate(routesAPI.services.getUpdates, {serviceId}), {params})
  }
}

export default ProductsService