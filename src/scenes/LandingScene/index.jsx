import React, {useState, useEffect} from 'react'
import ServicesPeriodicTable from './components/ServicesPeriodicTable';
import api from 'src/helpers/api';
import Routing, { routesAPI } from 'src/helpers/routing';
import ServiceLinking from 'src/services/ServiceLinking';


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
      this.searchShowWithIOOnly,
      this.searchRegionValue,
      this.searchRegionAvailabilityValue
    )
    return ServiceLinking.groupServicesByCategory(filteredServices, true)
  }
  toggleTreeSelectGreyed = function (event) {
    this.treeSelectFocused = (event && event.length !== 0)
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
    servicesData: null,
    azureRegions: {},
    lastConnectionsUpdate: null,
    lastAvailabilityUpdate: null,
  }
  // let [searchVal, setSearchVal] = useState(null)
  // let [servicesData, setServicesData] = useState(null)
  // let [azureRegions, setAzureRegions] = useState({})
  // let [lastConnectionsUpdate, setLastConnectionsUpdate] = useState(null)
  // let [lastAvailabilityUpdate, setLastAvailabilityUpdate] = useState(null)
  this.searchRegionAvailabilityValue =  ['ga', 'preview', 'expected']
  this.azureRegionsAvailabilitySelectOptions = [
    {id: 'ga', label: 'GA'},
    {id: 'preview', label: 'Preview'},
    {id: 'expected', label: 'Expected'},
  ]
  this.azureRegionsSelectOptions = []
  this.treeSelectFocused = false
  this.searchShowWithIOOnly = false
  this.searchRegionValue = null
  
  this.mapRendered = false
  this.mapSelector = '#service-vs-group-map'
  this.mapSelectorId = 'service-vs-group-map'
}


  componentDidMount() {
    api.get(Routing.generate(routesAPI.bootstrap))
    .then(res=>{
      let {services, serviceLinking, refServices, azureRegions} = res.data

      // setLastConnectionsUpdate(res.data.lastConnectionsUpdate)
      // setLastAvailabilityUpdate(res.data.lastAvailabilityUpdate)
      // setAzureRegions(azureRegions)

      ServiceLinking.init(services, serviceLinking, refServices, azureRegions)
      // SvsG = new ServicesVsGroupsForceDirectedTree(that.mapSelector,SL.azureServicesOnly, that)

      Object.keys(azureRegions).map( key => {
        this.azureRegionsSelectOptions.push({
          id: key,
          label: key,
          children: azureRegions[key].map(item => { return { id: item.slug, label: item.title, slug: item.slug } })
        })
      })

      // setServicesData(res.data.services)
      this.setState({
        searchVal: queryParameter('search'),
        lastConnectionsUpdate:  res.data.lastConnectionsUpdate,
        lastAvailabilityUpdate: res.data.lastAvailabilityUpdate,
        azureRegions: azureRegions,
        servicesData: res.data.services
      })
    })
  }
  
  render() {
    if (null === this.state.servicesData) {
      return 'Loading ...'
    }

    return (
        <ServicesPeriodicTable 
          filteredServicesList={this.filteredServicesList()}
        />
    )
  }
}

export default LandingScene