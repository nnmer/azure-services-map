class ServiceLinking {
  init (services, serviceLinks, refServices = {}, regions) {
    this._services = JSON.parse(JSON.stringify({ ...services, ...refServices }))
    this._regionsByGeo = JSON.parse(JSON.stringify({ ...regions }))
    this._regionsDic = {}
    this._servicesByRegionFilter = null
    this._filter = {
      regions: [],
      regionsAvailability: [],
      searchVal: null,
      searchShowWithIOOnly: null
    }
    this._sourceData = Object.assign({}, serviceLinks)
    this._flatServiceIOMap = {}
    this._servicesByCategoryArray = null

    for (let regionGroup in this._regionsByGeo) {
      this._regionsByGeo[regionGroup].map(item => {
        this._regionsDic[item.slug] = item.title
      })
    }

    this.buildFlatSourceTargetMap()
    this.mergeServicesWithRespectedIOServices()
    this._services = JSON.parse(JSON.stringify(this._services))
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
        that._flatServiceIOMap[serviceId][direction].map((iItem, iIdx) => {
          if (iItem.serviceId && that._flatServiceIOMap[iItem.serviceId].output) {

            that._flatServiceIOMap[iItem.serviceId][reverseDirection].map((oItem, oIdx) => {
              if (oItem.serviceId == serviceId) {
                let newConnUrlArray = []
                if (iItem.connectionDescriptionUrl) {
                  if (typeof iItem.connectionDescriptionUrl === 'string') {
                    newConnUrlArray.push(iItem.connectionDescriptionUrl)
                  } else if (typeof iItem.connectionDescriptionUrl === 'object') {
                    iItem.connectionDescriptionUrl.map((i) => newConnUrlArray.push(i))
                  }
                }
                if (oItem.connectionDescriptionUrl) {
                  if (typeof oItem.connectionDescriptionUrl === 'string') {
                    newConnUrlArray.push(oItem.connectionDescriptionUrl)
                  } else if (typeof oItem.connectionDescriptionUrl === 'object') {
                    oItem.connectionDescriptionUrl.map((i) => newConnUrlArray.push(i))
                  }
                }

                newConnUrlArray = newConnUrlArray.filter(function (value, index, self) {
                  return self.indexOf(value) === index
                })

                that._flatServiceIOMap[serviceId][direction][iIdx].connectionDescriptionUrl = Object.assign([], newConnUrlArray)
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
        this._services[key].servicesIO = { ...this._flatServiceIOMap[key] }
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

  get regionsDic () {
    return this._regionsDic
  }

  get servicesUnfiltered () {
    return this._services
  }

  get services () {
    if (!this._servicesByRegionFilter) {
      this.sourceServicesFilteredByRegionFilter()
    }
    return this._servicesByRegionFilter
  }

  get azureServicesOnly () {
    let azureOnly = {}
    Object.keys(this.servicesUnfiltered).map((key) => {
      if (this.servicesUnfiltered[key].isAzureProduct) {
        azureOnly[key] = this.servicesUnfiltered[key]
      }
    })
    return JSON.parse(JSON.stringify(azureOnly))
  }

  findServiceById(serviceId) {
    return this._services[serviceId] || null
  }
  
  groupServicesByCategory (servicesList, forceBuild = false) {
    if (this._servicesByCategoryArray === null || forceBuild) {
      this._servicesByCategoryArray = {}
      for (let serviceKey in servicesList) {
        let service = servicesList[serviceKey]
        for (let catKey in service.category) {

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
      this._servicesByCategoryArray = JSON.parse(JSON.stringify(this._servicesByCategoryArray))
    }

    return this._servicesByCategoryArray
  }

  resetFilter () {
    return this.applyFilter()
  }

  get filter () {
    return this._filter
  }

  /**
   * Services available (which are NOT not available) in specified regions
   */
  sourceServicesFilteredByRegionFilter () {
    let that = this
    let operationalData = Object.values(this._services)
    operationalData = JSON.parse(JSON.stringify(operationalData))

    function filterServicesIOByRegionFilter (servicesList) {
      servicesList.map((item, idx) => {
        let service = JSON.parse(JSON.stringify(item))

        if (that._filter.regions && that._filter.regions.length > 0) {
          if (service.servicesIO.input && service.servicesIO.input.length > 0) {
            let newList = service.servicesIO.input.filter(item => {
              return !!(!item.serviceId || servicesList.filter(i => i.id === item.serviceId).length > 0)
            })

            service.servicesIO.input = newList
          }

          if (service.servicesIO.output && service.servicesIO.output.length > 0) {
            let newList = service.servicesIO.output.filter(item => {
              return !!(!item.serviceId || servicesList.filter(i => i.id === item.serviceId).length > 0)
            })

            service.servicesIO.output = newList
          }
        }

        servicesList[idx] = service
      })

      return servicesList
    }

    if (this._filter.regions && this._filter.regions.length > 0) {
      let filteredData = operationalData.filter(function (service) {
        if (service.availability && Object.keys(service.availability).length > 0) {
          let matchedRegions = Object.keys(service.availability).filter(
            key => {
              return /* service.availability[key].available === true && */ -1 !== that._filter.regions.indexOf(key)
              && that._filter.regionsAvailability.filter(i => {
                return (i === 'ga' && service.availability[key].inGA)
                || (i === 'preview' && service.availability[key].inPreview)
                || (i === 'expected' && service.availability[key].expectation.length > 0)
              }).length > 0
            }
          )
          return matchedRegions && (matchedRegions).length > 0
        }
        return false
      })

      operationalData = [...filteredData]
    }

    operationalData = filterServicesIOByRegionFilter(operationalData)
    this._servicesByRegionFilter = {}
    operationalData.map(item => {
      this._servicesByRegionFilter[item.id] = item
    })
    this._servicesByRegionFilter = JSON.parse(JSON.stringify(this._servicesByRegionFilter))

    return operationalData
  }

  filterServiceAvailabilityByRegionFilter (serviceAvailability) {
    let newAvailability = {}
    if (this._filter.regions && this._filter.regions.length > 0) {
      Object.keys(serviceAvailability).map(key => {
        if (-1 !== this._filter.regions.indexOf(key)
          && this._filter.regionsAvailability.filter(i => {
            return (i === 'ga' && serviceAvailability[key].inGA)
              || (i === 'preview' && serviceAvailability[key].inPreview)
              || (i === 'expected' && serviceAvailability[key].expectation.length > 0)
          }).length > 0) {
          newAvailability[key] = serviceAvailability[key]
        }
      })
    } else {
      newAvailability = Object.assign({}, serviceAvailability)
    }

    return newAvailability
  }

  applyFilter (searchVal, searchShowWithIOOnly, searchRegionValue, searchRegionAvailabilityValue) {

    this._filter = {
      regions: searchRegionValue,
      regionsAvailability: searchRegionAvailabilityValue,
      searchVal: searchVal,
      searchShowWithIOOnly: searchShowWithIOOnly
    }

    let operationalData = this.sourceServicesFilteredByRegionFilter()

    if (searchVal) {
      let regex = new RegExp('' + searchVal + '', 'igm')

      let filteredData = operationalData.filter(function (service) {
        return service.name.search(regex) !== -1
      })
      operationalData = Object.assign([], filteredData)
    }

    if (searchShowWithIOOnly) {
      let ioOnly = operationalData.filter(function (service) {
        return (service.servicesIO.input && service.servicesIO.input.length > 0)
          || (service.servicesIO.output && service.servicesIO.output.length > 0)
      })
      operationalData = Object.assign([], ioOnly)
    }

    let filteredServices = {}
    operationalData.map(item => {
      filteredServices[item.id] = item
    })

    filteredServices = JSON.parse(JSON.stringify(filteredServices))

    return filteredServices
  }
}


export default new ServiceLinking()