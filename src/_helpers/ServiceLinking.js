export default class ServiceLinking {
  constructor (services, serviceLinks) {
    this.services = Object.assign({}, services)
    this.sourceData = Object.assign({}, serviceLinks)
    this.flatServiceIOMap = {}
    this.servicesByCategoryArray = null

    this.buildFlatSourceTargetMap()
    this.mergeServicesWithRespectedIOServices()
    this.deduplicateIOlist()
  }

  buildFlatSourceTargetMap () {
    for (let key in this.sourceData) {
      let item = this.sourceData[key]
      let that = this

      this.flatServiceIOMap[key] = this.flatServiceIOMap[key] || { input: [], output: [] }

      if (undefined !== item.output && typeof item.output === 'object') {
        let out = item.output.map(function (i) { return that.name2Key(i) })
        Array.prototype.push.apply(this.flatServiceIOMap[key].output, out)

        out.map(function (outputElement) {
          that.flatServiceIOMap[outputElement] = that.flatServiceIOMap[outputElement] || { input: [], output: [] }
          that.flatServiceIOMap[outputElement].input.push(key)
        })
      }

      if (undefined !== item.input && typeof item.input === 'object') {
        let inputs = item.input.map(function (i) { return that.name2Key(i) })
        Array.prototype.push.apply(this.flatServiceIOMap[key].input, inputs)
        inputs.map(function (inputElement) {
          that.flatServiceIOMap[inputElement] = that.flatServiceIOMap[inputElement] || { input: [], output: [] }
          that.flatServiceIOMap[inputElement].output.push(key)
        })
      }
    }
  }

  mergeServicesWithRespectedIOServices () {
    for (let key in this.flatSourceTargetMap) {
      if (this.services[key]) {
        this.services[key].servicesIO = this.flatSourceTargetMap[key]
        this.services[key].hasLinkingServices =
        !!(((this.services[key].servicesIO.input || this.services[key].servicesIO.output)))
      }
    }
  }

  deduplicateIOlist () {
    function onlyUnique (value, index, self) {
      return self.indexOf(value) === index
    }

    for (let key in this.flatServiceIOMap) {
      this.flatServiceIOMap[key].input = (this.flatServiceIOMap[key].input).filter(onlyUnique).sort()
      this.flatServiceIOMap[key].output = (this.flatServiceIOMap[key].output).filter(onlyUnique).sort()
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

  get service () {
    return this.services
  }

  get servicesByCategory () {
    if (this.servicesByCategoryArray === null) {
      for (let serviceKey in this.services) {
        let service = this.services[serviceKey]
        for (let catKey in service.category) {
          if (!this.servicesByCategoryArray) {
            this.servicesByCategoryArray = {}
          }

          if (!this.servicesByCategoryArray[service.category[catKey]]) {
            this.servicesByCategoryArray[service.category[catKey]] = {}
          }

          this.servicesByCategoryArray[service.category[catKey]][service.id] = service
        }
      }

      let that = this
      Object.keys(this.servicesByCategoryArray).forEach(function (key) {
        that.servicesByCategoryArray[key] = Object.values(that.sortObjByKeys(that.servicesByCategoryArray[key]))
      })

      this.servicesByCategoryArray = this.sortObjByKeys(this.servicesByCategoryArray)
    }

    return this.servicesByCategoryArray
  }

  get flatSourceTargetMap () {
    return this.flatServiceIOMap
  }
}
