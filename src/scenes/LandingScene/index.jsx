import React from 'react'
import ServicesPeriodicTable from './components/ServicesPeriodicTable';
import api from 'src/helpers/api';
import Routing, { routesAPI } from 'src/helpers/routing';
import ServiceLinking from 'src/services/ServiceLinking';
import Filter from './components/Filter';
import 'simplebar/dist/simplebar.css';
import isEqual from 'lodash/isEqual'
import {detect as browserDetect} from 'detect-browser'
import LoadingPlaceholder from 'src/components/LoadingPlaceholder';
import BrowserNotSupported from 'src/components/error/browserNotSupported';

function queryParameters () {
  let varPairs = []
  let query = window.location.search.substring(1)

  if (query.length > 0) {
    let vars = query.split('&')

    for (let i = 0; i < vars.length; i++) {
      let pairs = vars[i].split('=')
      varPairs[pairs[0]] = decodeURIComponent(pairs[1]).replace(/\+/g,' ')
    }
  }

  return varPairs
}

function queryParameter (key) {
  return queryParameters()[key] || null
}



class LandingScene extends React.Component {

  filteredServicesList = () => {
    let filteredServices = ServiceLinking.applyFilter(
      this.state.searchVal,
      this.state.searchWithIOOnly,
      this.state.searchGeoVal,
      this.state.searchGeoAvailabilityVal
    )
    return ServiceLinking.groupServicesByCategory(filteredServices, true)
  }
  
  renderMap = function () {
    SvsG.render()
    SvsG.applyFilter()
  }
  changeServicesView = function (newViewValue) {
    this.currentView = newViewValue
  }
  clearSearchField = () => setSearchVal(null)

  // const searchVal = function (val) {
  //   this.$root.$emit('app::hide::popover::all')
  //   SvsG.searchValue = val
  // }
  currentView = function (val = 'table') {
    let that = this
    if (this.mapRendered === false) {
      setTimeout(function () {
        that.renderMap()
        that.mapRendered = true
      }, 200)
    }
  }

constructor(props) {
  super(props)
  this.state = {
    searchVal: null,
    searchGeoVal: [],
    searchGeoAvailabilityVal:  ['ga', 'preview', 'expected'],
    searchWithIOOnly: false,
    servicesData: null,
    azureRegions: {},
    lastConnectionsUpdate: null,
    lastAvailabilityUpdate: null,
  }
  
  this.azureRegionsAvailabilitySelectOptions= [
    {value: 'ga', label: 'GA', checked: true, disabled: true, tagClassName: 'disabled'},
    {value: 'preview', label: 'Preview', checked: true, disabled: true, tagClassName: 'disabled'},
    {value: 'expected', label: 'Expected', checked: true, disabled: true, tagClassName: 'disabled'},
  ]
  this.azureRegionsSelectOptions = []
  this.mapRendered = false
  this.mapSelector = '#service-vs-group-map'
  this.mapSelectorId = 'service-vs-group-map'
  this.browser = browserDetect()
}


  componentDidMount() {
    api.get(Routing.generate(routesAPI.bootstrap))
    .then(res=>{
      let {services, serviceLinking, refServices, azureRegions} = res.data

      ServiceLinking.init(services, serviceLinking, refServices, azureRegions)
      // SvsG = new ServicesVsGroupsForceDirectedTree(that.mapSelector,SL.azureServicesOnly, that)

      Object.keys(azureRegions).map( key => {
        let item = {
          value: key,
          label: key,
        }
        if (!(azureRegions[key].length === 1 && azureRegions[key][0].title === key)) {
          let valueTree = []
          item.children =  azureRegions[key].map(item => { 
            valueTree.push(item.slug)
            return { 
              value: [item.slug], 
              label: item.title, 
              slug: item.slug,
              actions: [{
                text: `(${item.slug})`,
                className: 'geo-slug',
              }]
            } 
          })
          item.value = valueTree
        } else {
          item.value = [azureRegions[key][0].slug]
        }

        this.azureRegionsSelectOptions.push(item)
      })      

      this.setState({
        searchVal: queryParameter('search'),
        lastConnectionsUpdate:  res.data.lastConnectionsUpdate,
        lastAvailabilityUpdate: res.data.lastAvailabilityUpdate,
        azureRegions: azureRegions,
        servicesData: res.data.services
      })
    })
  }

  onFilterChange = (e)=>{

    this.setState(curValues => {
      return {
        ...curValues,
        searchVal: e.searchVal ? e.searchVal.trim() : '',
        searchGeoVal: e.geoVal,
        searchGeoAvailabilityVal: e.availabilityVal,
        searchWithIOOnly: e.servicesOnlyWithIO,
      }
    })
  }

  shouldComponentUpdate( nextProps, nextState) {
    return !isEqual(nextState,this.state)
  }  
  
  render() {

    if (this.browser && this.browser.name=='ie') {
      return <BrowserNotSupported browser={this.browser}/>
    }

    if (null === this.state.servicesData) {
      return <LoadingPlaceholder alignCenter={true}/>
    }
    let data = this.filteredServicesList()
    return (
      <>
        <div className="mb-3">
        <Filter 
          searchVal={this.state.searchVal}
          regionsSource={this.azureRegionsSelectOptions}
          availabilityOptions={[...this.azureRegionsAvailabilitySelectOptions]}
          onFilterChange={this.onFilterChange}
          lastConnectionsUpdate={this.state.lastConnectionsUpdate}
          lastAvailabilityUpdate={this.state.lastAvailabilityUpdate}
        />
        </div>
        <ServicesPeriodicTable 
          filteredServicesList={data}
        />
      </>
    )
  }
}

export default LandingScene