<template>
  <div class="container-fluid">
    <div class="row">

      <main role="main" class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 class="h2">Azure services</h1>
          <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group mr-2">
              <button type="button" class="btn btn-sm btn-outline-secondary"
                v-bind:class="{active: currentView=='tree'}"
                v-on:click="changeServicesTreeView('tree')">
                Table view
              </button>
              <button type="button" class="btn btn-sm btn-outline-secondary"
              v-bind:class="{active: currentView=='map'}"
                v-on:click="changeServicesTreeView('map');">
                Map view
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-8 col-sm-6">
            <input
              class="form-control form-control-dark w-100 search-input"
              type="text" placeholder="Search" aria-label="Search"
              v-model="searchVal"
              v-on:keydown.esc="clearSearchField"
            >
          </div>
          <div class="col-lg-4 col-sm-6" v-if="currentView=='tree'">
            - services may be placed in several service groups; <br/>
            - <i class="has-linking-services" style="padding: 0 8px;"></i> &nbsp;&nbsp;a service with input/output connection
          </div>
          <div class="col-lg-4 col-sm-6" v-if="currentView=='map'">
            <svg width="20" height="20">
                <circle cx="10" cy="10" class="node node-category" style="r: 10"></circle>
              </svg> &nbsp;- a service group
              <br/>
            <svg width="20" height="20">
              <circle cx="10" cy="10" class="node has-linking-services"></circle>
            </svg> &nbsp;- a service with input/output connections
          </div>
        </div>

        <div class="data-container">
          <ServiceVsGroupsTable
            v-bind:class="{'d-none': currentView!='tree'}"
            class="data-container-tree"
            :filteredServicesList="filteredServicesList"
          />
          <ServiceVsGroupsForcedTree
            v-bind:class="{'d-none': currentView!='map'}"
          />
        </div>

      </main>

    </div>
  </div>
</template>

<script>
import ServiceVsGroupsForcedTree from './ServiceVsGroupsForcedTree'
import ServiceVsGroupsTable from './ServiceVsGroupsTable'
import axios from 'axios'
import ServiceLinking from 'src/_helpers/ServiceLinking'
import ServicesVsGroupsForceDirectedTree from 'src/_helpers/ServicesVsGroupsForceDirectedTree'

export default {
  name: 'ServiceVsGroups',
  components: {
    ServiceVsGroupsForcedTree,
    ServiceVsGroupsTable
  },
  data: function () {
    return {
      searchVal: null,
      servicesList: [],
      currentView: 'tree',
      mapRendered: false
    }
  },
  created: function () {
    let that = this
    axios.all([
      axios.get('js/data/azure-services.json'),
      axios.get('js/data/azure-services-linking.json')
    ]).then(function ([services, serviceLinking]) {
      SL = new ServiceLinking(services.data, serviceLinking.data)
      SvsG = new ServicesVsGroupsForceDirectedTree(SL.services)
      that.servicesList = SL.servicesByCategory
    })
  },
  computed: {
    filteredServicesList: function () {
      if (!this.searchVal) {
        return this.servicesList
      }

      let filteredData = {}
      let regex = new RegExp('' + this.searchVal + '', 'i')
      for (let category in this.servicesList) {
        let matchedServices = this.servicesList[category].filter(function (service) {
          return service.name.search(regex) !== -1
        })
        if (matchedServices.length > 0) {
          filteredData[category] = matchedServices
        }
      }

      return filteredData
    }
  },
  watch: {
    searchVal: function (val) {
      // $('.service-list-col-service-item').popover('dispose')
      SvsG.searchValue = val
    },
    currentView: function (val) {
      let that = this
      if (this.mapRendered === false) {
        setTimeout(function () {
          that.renderMap()
          that.mapRendered = true
        }, 200)
      }
    }
  },
  methods: {
    renderMap: function () {
      // SvsG.render()
      // SvsG.applyFilter()
    },
    changeServicesTreeView: function (newViewValue) {
      this.currentView = newViewValue
    },
    clearSearchField: function () {
      this.searchVal = null
    },
    showServiceTooltip: function (serviceId, element) {
      // $('.service-list-col-service-item').popover('dispose')
      // $('#'+element)
      //   .popover({
      //     title: SL.service[serviceId].name,
      //     content: tmpl("service_node_popover", SL.service[serviceId]),
      //     sanitize: false,
      //     // trigger: 'click',
      //     html: true
      //   })
      //   .popover('show')
    }
  }
}
</script>
