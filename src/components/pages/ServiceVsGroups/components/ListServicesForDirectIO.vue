<template>
  <div>
    <div class="list-group-item"
      v-for="(item) in dataSource">

        <div v-if="item.serviceId && hasService(item.serviceId)">
          <img
            v-if="SL(item.serviceId).icon"
            class="service-icon"
            :src="SL(item.serviceId).icon"
          />

          {{item.aliasTitle || (SL(item.serviceId) ? SL(item.serviceId).name : item.serviceId)}}
          <a :href="SL(item.serviceId).url" target="_blank">Service doc</a>
          <span v-if="item.connectionDescriptionUrl">
            |
            <ConnectionDescriptionLinks
              :dataSource="item.connectionDescriptionUrl"
            />
          </span>
        </div>
        <div v-else>
          {{item.aliasTitle}}
          <span v-if="item.connectionDescriptionUrl">

            <ConnectionDescriptionLinks
              :dataSource="item.connectionDescriptionUrl"
            />

          </span>
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
    SL: function(item) {
      return SL.services[item]
    },
    hasService: function (item) {
      return SL.services[item] || null
    }
  }
}
</script>
