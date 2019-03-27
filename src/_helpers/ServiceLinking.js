export default class ServiceLinking {
  constructor (services, serviceLinks, refServices = {}) {
    this._services = Object.assign({}, services, refServices)
    this._sourceData = Object.assign({}, serviceLinks)
    this._flatServiceIOMap = {}
    this._servicesByCategoryArray = null

    this.buildFlatSourceTargetMap()
    this.mergeServicesWithRespectedIOServices()
    this.deduplicateIOlist()
  }

  buildFlatSourceTargetMap () {
    for (let serviceId in this._sourceData) {
      let item = this._sourceData[serviceId]
      let that = this

      this._flatServiceIOMap[serviceId] = this._flatServiceIOMap[serviceId] || { input: [], output: [] }

      if (undefined !== item.output && typeof item.output === 'object') {
        Array.prototype.push.apply(this._flatServiceIOMap[serviceId].output, item.output)

        item.output.map(function (outputElement) {
          if (null !== outputElement.serviceId){
            that._flatServiceIOMap[outputElement.serviceId] = that._flatServiceIOMap[outputElement.serviceId] || { input: [], output: [] }
            that._flatServiceIOMap[outputElement.serviceId].input.push({serviceId})
          }
        })
      }

      if (undefined !== item.input && typeof item.input === 'object') {
        Array.prototype.push.apply(this._flatServiceIOMap[serviceId].input, item.input)

        item.input.map(function (inputElement) {
          if (null !== inputElement.serviceId) {
            that._flatServiceIOMap[inputElement.serviceId] = that._flatServiceIOMap[inputElement.serviceId] || { input: [], output: [] }
            that._flatServiceIOMap[inputElement.serviceId].output.push({serviceId})
          }
        })
      }
    }
  }

  mergeServicesWithRespectedIOServices () {
    for (let key in this._flatServiceIOMap) {
      if (this._services[key]) {
        this._services[key].servicesIO = this._flatServiceIOMap[key]
        this._services[key].hasLinkingServices =
        !!(((this._services[key].servicesIO.input || this._services[key].servicesIO.output)))
      }
    }
  }

  deduplicateIOlist () {
    function onlyUnique (value, index, self) {
      return self.indexOf(value) === index
    }

    for (let key in this._flatServiceIOMap) {
      this._flatServiceIOMap[key].input = (this._flatServiceIOMap[key].input).filter(onlyUnique).sort()
      this._flatServiceIOMap[key].output = (this._flatServiceIOMap[key].output).filter(onlyUnique).sort()
    }
  }

  sortObjByKeys (obj) {
    let ordered = {}
    Object.keys(obj).sort().forEach(function (key) {
      ordered[key] = obj[key]
    })
    return ordered
  }

  // @deprecated
  get service () {
    return this._services
  }

  get services () {
    return this._services
  }

  get azureServicesOnly () {
    let azureOnly = {}
    Object.keys(this._services).map((key)=> {
      if (this._services[key].isAzureProduct) {
        azureOnly[key] = this._services[key]
      }
    })
    return azureOnly
  }

  get servicesByCategory () {
    if (this._servicesByCategoryArray === null) {
      for (let serviceKey in this._services) {
        let service = this._services[serviceKey]
        for (let catKey in service.category) {
          if (!this._servicesByCategoryArray) {
            this._servicesByCategoryArray = {}
          }

          if (!this._servicesByCategoryArray[service.category[catKey]]) {
            this._servicesByCategoryArray[service.category[catKey]] = {}
          }

          this._servicesByCategoryArray[service.category[catKey]][service.id] = service
        }
      }

      let that = this
      Object.keys(this._servicesByCategoryArray).forEach(function (key) {
        that._servicesByCategoryArray[key] = Object.values(that.sortObjByKeys(that._servicesByCategoryArray[key]))
      })

      this._servicesByCategoryArray = this.sortObjByKeys(this._servicesByCategoryArray)
    }

    return this._servicesByCategoryArray
  }
}
