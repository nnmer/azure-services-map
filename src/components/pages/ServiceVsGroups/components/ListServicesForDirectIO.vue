<template>
  <div>
    <div class="list-group-item"
      v-for="(ioItem) in dataSource">

        <div v-if="ioItem.serviceId && hasService(ioItem.serviceId)">
          <div class="pull-left">
            <img
              v-if="getServiceData(ioItem.serviceId).icon"
              class="service-icon m-r-5"
              :src="getServiceData(ioItem.serviceId).icon"
            />

            <span v-if="hasService(ioItem.serviceId)" class="m-r-5">
              <a href="#"
                @click="$root.$emit('app::services::direct-io-modal::show', $event, ioItem.serviceId)"
                >{{serviceRenderName(ioItem)}}</a>
            </span>
            <span v-else  class="m-r-5">
              {{serviceRenderName(ioItem)}}
            </span>
          </div>
          <div class="pull-right service-item-doc-links">
            <a :href="getServiceData(ioItem.serviceId).url" target="_blank">Service doc</a>
            <span v-if="ioItem.connectionDescriptionUrl && ioItem.connectionDescriptionUrl.length >= 1">
              |
              <ConnectionDescriptionLinks
                :dataSource="ioItem.connectionDescriptionUrl"
              />
            </span>
          </div>
          <div class="clearfix"/>
        </div>
        <div v-else>
          <div class="pull-left">
            {{ioItem.aliasTitle}}
          </div>
          <div v-if="ioItem.connectionDescriptionUrl" class="pull-right service-item-doc-links">
            <ConnectionDescriptionLinks
              :dataSource="ioItem.connectionDescriptionUrl"
            />
          </div>
          <div class="clearfix"/>
        </div>
    </div>
  </div>
</template>

<script>
import ConnectionDescriptionLinks from './ConnectionDescriptionLinks'

export default {
  name: 'ListServicesForDirectIO',
  props: {
    dataSource: Array
  },
  components: {
    ConnectionDescriptionLinks
  },
  methods: {
    getServiceData: function(serviceId) {
      return SL.services[serviceId]
    },
    hasService: function (serviceId) {
      return SL.services[serviceId] || null
    },
    serviceRenderName: function(ioItem) {
      return ioItem.aliasTitle || (this.hasService(ioItem.serviceId) ? this.getServiceData(ioItem.serviceId).name : ioItem.serviceId)
    }
  }
}
</script>
