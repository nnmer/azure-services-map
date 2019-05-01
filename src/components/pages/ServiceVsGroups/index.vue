<template>
  <div class="container-fluid">
    <div class="row">

      <main role="main" class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 class="h2">Azure services</h1>
          <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group mr-2">
              <button type="button" class="btn btn-sm btn-outline-secondary"
                v-bind:class="{active: currentView=='table'}"
                v-on:click="changeServicesView('table')">
                Table view
              </button>
              <button type="button" class="btn btn-sm btn-outline-secondary"
              v-bind:class="{active: currentView=='map'}"
                v-on:click="changeServicesView('map');">
                Map view
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-6 col-sm-6">
            <div class="input-group">

              <input
                class="form-control form-control-dark  search-input"
                type="text" placeholder="Search" aria-label="Search"
                v-model="searchVal"
                v-on:keydown.esc="clearSearchField"
              >
              <div class="input-group-append clear-search-x"
                v-if="searchVal"
                @click="clearSearchField"
                >
                <div class="input-group-text">
                  <img src="img/x.png" width="10px"/>
                </div>
              </div>
            </div>

            <b-form-checkbox
              v-if="currentView=='table'"
              v-model="searchShowWithIOOnly"
            >
              Show services with In/Out connections only
            </b-form-checkbox>

          </div>
          <div class="col-lg-6 col-sm-6" v-if="currentView=='table'">
            <div class="row">
              <div class="col-12">
                <treeselect
                  :class="!treeSelectFocused ? 'treeselect-no-focus-greyed' : ''"
                  v-model="searchRegionValue"
                  :multiple="true"
                  :options="azureRegionsSelectOptions"
                  value-consists-of="LEAF_PRIORITY"
                  placeholder="Filter by Region. By default all services are listed"
                  v-on:open="toggleTreeSelectGreyed"
                  v-on:close="toggleTreeSelectGreyed"
                  v-on:input="toggleTreeSelectGreyed"
                >
                  <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
                    {{ node.label }}
                    <span v-if="!node.isBranch" class="text-black-50">({{node.raw.slug}})</span>
                  </label>
                </treeselect>
              </div>
              <!--<div class="col-2"><strong>Note:</strong></div>
              <div class="col-10">
              - services may be placed in several service groups; <br/>
              <span class="text-darkred">- services may have direct links to how-to connect docs;</span> <br/>
              - <i class="has-linking-services help-note" style="padding: 0 8px;"></i> &nbsp;&nbsp;a service with input/output connection
              </div>-->
            </div>
          </div>
          <div class="col-lg-6 col-sm-6" v-if="currentView=='map'">
            <div class="row">
              <div class="col-2">&nbsp;</div>
              <div class="col-10">
                <svg width="20" height="20">
                    <circle cx="10" cy="10" class="node node-category" r="10" style="r: 10"></circle>
                  </svg> &nbsp;- a service group
                  <br/>
                <svg width="20" height="20">
                  <circle cx="10" cy="10" class="node has-linking-services" r="10"></circle>
                </svg> &nbsp;- a service with input/output connections
              </div>
            </div>
          </div>
        </div>

        <div class="data-container">
          <ServiceVsGroupsTable
            v-bind:class="{'d-none': currentView!='table'}"
            :filteredServicesList="filteredServicesList"
          />
          <ServiceVsGroupsForcedTree
            v-bind:class="{'d-none': currentView!='map'}"
            :selectorId="mapSelectorId"
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'ServiceVsGroups',
  components: {
    ServiceVsGroupsForcedTree,
    ServiceVsGroupsTable,
    Treeselect
  },
  data: function () {
    return {
      dataInitialized: false,
      treeSelectFocused: false,
      searchVal: null,
      searchShowWithIOOnly: false,
      searchRegionValue: null,
      azureRegionsSelectOptions: [],
      azureRegions: {},
      currentView: 'table',
      mapRendered: false,
      mapSelector: '#service-vs-group-map',
      mapSelectorId: 'service-vs-group-map'
    }
  },
  created: function () {
    let that = this
    axios.defaults.headers.get['Cache-Control'] = 'no-cache';
    axios.all([
      axios.get('js/data/azure-services.json'),
      axios.get('js/data/azure-services-linking.json'),
      axios.get('js/data/ref-services.json'),
      axios.get('js/data/azure-regions.json')
    ]).then(function ([services, serviceLinking, refServices, azureRegions]) {
      SL = new ServiceLinking(services.data, serviceLinking.data, refServices.data, azureRegions.data)
      SvsG = new ServicesVsGroupsForceDirectedTree(that.mapSelector,SL.azureServicesOnly, that)
      that.dataInitialized = true
      that.azureRegions = azureRegions.data

      Object.keys(that.azureRegions).map( key => {
        that.azureRegionsSelectOptions.push({
          id: key,
          label: key,
          children: that.azureRegions[key].map(item => { return { id: item.slug, label: item.title, slug: item.slug } })
        })
      })
    })

    this.$root.$on('click::at::page', function(event){
      if ( (that.currentView === 'table' && !event.srcElement.closest('.service-list-col-service-item'))
        || (that.currentView === 'map' && !event.srcElement.id.match(/service-node*/i)) ) {
        //console.warn('call ALL popover hide')
        that.$root.$emit('bv::hide::popover')
      }
    })

    this.$root.$on('app::hide::popover::all', function(event) {
      that.$root.$emit('bv::hide::popover')
    })
  },
  computed: {
    filteredServicesList: function () {
      if (this.dataInitialized) {
        let filteredServices = SL.applyFilter(
          this.searchRegionValue,
          this.searchVal,
          this.searchShowWithIOOnly
        )
        return SL.groupServicesByCategory(filteredServices, true)
      }

      return []
    }
  },
  watch: {
    searchVal: function (val) {
      this.$root.$emit('app::hide::popover::all')
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
    toggleTreeSelectGreyed: function (event) {
      this.treeSelectFocused = (event && event.length !== 0)
    },
    renderMap: function () {
      SvsG.render()
      SvsG.applyFilter()
    },
    changeServicesView: function (newViewValue) {
      this.currentView = newViewValue
    },
    clearSearchField: function () {
      this.searchVal = null
    }
  }
}
</script>
