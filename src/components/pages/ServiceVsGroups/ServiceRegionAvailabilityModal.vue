<template>
  <b-modal
    id="service-region-availability-modal"
    :title="service ? `'${service.name}' is available at:` : ''"
    :no-fade="true"
    :hide-footer="true"
    scrollable
  >
    <table class="table table-sm" v-if="service">
      <tr v-for="(idx,key) in serviceAvailability">
        <th>
          {{regionTitle(key)}}
        </th>
        <td>
          {{service.availability[key].inGA ? 'GA' : ''}}
          {{service.availability[key].inPreview ? 'Preview' : ''}}
          {{service.availability[key].expectation ? service.availability[key].expectation : ''}}
        </td>
      </tr>
    </table>
  </b-modal>
</template>

<script>
export default {
  name: 'ServiceRegionAvailabilityModal',
  data: function () {
    return {
      service: null
    }
  },
  mounted: function () {
    this.$root.$on('app::services::region-availability-modal::show', this.showModal)
  },
  computed: {
    serviceAvailability: function () {
      return SL.filterServiceAvailabilityByRegionFilter(this.service.availability)
    }
  },
  methods: {
    regionTitle: function(key) {
      return SL.regionsDic[key]
    },
    showModal: function (event, serviceId) {
      let that = this
      this.service = null

      this.$nextTick( function(){
        that.service = SL.services[serviceId] || null
        if (!this.service) {
          //console.warn('Service is NULL, skip init modal')
          return
        }
        that.$root.$emit('bv::show::modal', 'service-region-availability-modal', event)
      })
    }
  }
}
</script>
