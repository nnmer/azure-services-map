export default class ServiceLinking {
  constructor (services, serviceLinks) {
    this._services = Object.assign({}, services)
    this._sourceData = Object.assign({}, serviceLinks)
    this._flatServiceIOMap = {}
    this._servicesByCategoryArray = null

    this.buildFlatSourceTargetMap()
    this.mergeServicesWithRespectedIOServices()
    this.deduplicateIOlist()
  }

  buildFlatSourceTargetMap () {
    for (let key in this._sourceData) {
      let item = this._sourceData[key]
      let that = this

      this._flatServiceIOMap[key] = this._flatServiceIOMap[key] || { input: [], output: [] }

      if (undefined !== item.output && typeof item.output === 'object') {
        let out = item.output.map(function (i) { return that.name2Key(i) })
        Array.prototype.push.apply(this._flatServiceIOMap[key].output, out)

        out.map(function (outputElement) {
          that._flatServiceIOMap[outputElement] = that._flatServiceIOMap[outputElement] || { input: [], output: [] }
          that._flatServiceIOMap[outputElement].input.push(key)
        })
      }

      if (undefined !== item.input && typeof item.input === 'object') {
        let inputs = item.input.map(function (i) { return that.name2Key(i) })
        Array.prototype.push.apply(this._flatServiceIOMap[key].input, inputs)
        inputs.map(function (inputElement) {
          that._flatServiceIOMap[inputElement] = that._flatServiceIOMap[inputElement] || { input: [], output: [] }
          that._flatServiceIOMap[inputElement].output.push(key)
        })
      }
    }
  }

  mergeServicesWithRespectedIOServices () {
    for (let key in this.flatSourceTargetMap) {
      if (this._services[key]) {
        this._services[key].servicesIO = this.flatSourceTargetMap[key]
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

  name2Key (name) {
    if (name.search(/^\(external\)/) !== -1) {
      return name
    }

    let key = String(name)
      .toLowerCase()
      .replace(/\(|\)/gi, '')
      .trim()
      .replace(/ /g, '-')

    return key
  }

  sortObjByKeys (obj) {
    let ordered = {}
    let that = this
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

  get flatSourceTargetMap () {
    return this._flatServiceIOMap
  }
}
