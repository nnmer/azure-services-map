export default class ServiceLinking {
  constructor (services, serviceLinks, refServices = {}) {
    this._services = Object.assign({}, services, refServices)
    this._sourceData = Object.assign({}, serviceLinks)
    this._flatServiceIOMap = {}
    this._servicesByCategoryArray = null

    this.buildFlatSourceTargetMap()
    this.mergeServicesWithRespectedIOServices()
  }

  buildFlatSourceTargetMap () {
    let that = this

    function sortByServiceName(a,b) {
      // a hack to have not Azure services on the bottom
      let nA = (a.serviceId ? '' : 'z') + (a.aliasTitle || that._services[a.serviceId].name).toUpperCase()
      let nB = (b.serviceId ? '' : 'z') + (b.aliasTitle || that._services[b.serviceId].name).toUpperCase()

      if (nA < nB) {
        return -1
      }
      if (nA > nB) {
        return 1
      }
      return 0
    }

    function deduplicateIOlist(listData) {
      let newData = []
      listData.forEach((item)=>{
        var idx = newData.findIndex(i => i.serviceId == item.serviceId && i.aliasTitle == item.aliasTitle);
        if(idx == -1){
          newData.push(item);
        } else {
          if (item.connectionDescriptionUrl) {

            if (!newData[idx].connectionDescriptionUrl) {
              newData[idx].connectionDescriptionUrl= []
            }
            if (typeof newData[idx].connectionDescriptionUrl === 'string') {
              newData[idx].connectionDescriptionUrl = [newData[idx].connectionDescriptionUrl]
            }

            if (typeof item.connectionDescriptionUrl === 'string') {
              newData[idx].connectionDescriptionUrl.push(item.connectionDescriptionUrl)
            }else {
              Array.prototype.push.apply(newData[idx].connectionDescriptionUrl, item.connectionDescriptionUrl)
            }
          }
        }
      })

      return newData
    }

    function mergeInputWithRespectedOutputConnectionUrls (serviceId, direction) {
      let reverseDirection = direction === 'input' ? 'output' : 'input'
      if (that._flatServiceIOMap[serviceId][direction]) {
        that._flatServiceIOMap[serviceId][direction].map((iItem, iIdx)=>{
          if (iItem.serviceId && that._flatServiceIOMap[iItem.serviceId].output) {
            
            that._flatServiceIOMap[iItem.serviceId][reverseDirection].map((oItem, oIdx)=>{
              if (oItem.serviceId == serviceId) {
                let newConnUrlArray = []
                if (iItem.connectionDescriptionUrl) {
                  if (typeof iItem.connectionDescriptionUrl === 'string') {
                    newConnUrlArray.push(iItem.connectionDescriptionUrl)
                  } else if (typeof iItem.connectionDescriptionUrl === 'object') {
                    iItem.connectionDescriptionUrl.map((i)=>newConnUrlArray.push(i))
                  }
                }
                if (oItem.connectionDescriptionUrl) {
                  if (typeof oItem.connectionDescriptionUrl === 'string') {
                    newConnUrlArray.push(oItem.connectionDescriptionUrl)
                  } else if (typeof oItem.connectionDescriptionUrl === 'object') {
                    oItem.connectionDescriptionUrl.map((i)=>newConnUrlArray.push(i))
                  }
                }

                newConnUrlArray = newConnUrlArray.filter(function(value, index, self) {
                  return self.indexOf(value) === index
                })

                that._flatServiceIOMap[serviceId][direction][iIdx].connectionDescriptionUrl = Object.assign([],newConnUrlArray)
                that._flatServiceIOMap[iItem.serviceId][reverseDirection][oIdx].connectionDescriptionUrl = Object.assign([],newConnUrlArray)
              }
            })
          }
        })
      }
    }

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

    for (let serviceId in this._flatServiceIOMap) {
      this._flatServiceIOMap[serviceId].input = deduplicateIOlist(this._flatServiceIOMap[serviceId].input)
      this._flatServiceIOMap[serviceId].output = deduplicateIOlist(this._flatServiceIOMap[serviceId].output)

      mergeInputWithRespectedOutputConnectionUrls(serviceId,'input')
      mergeInputWithRespectedOutputConnectionUrls(serviceId,'output')

      this._flatServiceIOMap[serviceId].input.sort(sortByServiceName)
      this._flatServiceIOMap[serviceId].output.sort(sortByServiceName)
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
