<template>
  <b-modal
    id="service-region-availability-modal"
    :title="service ? `${service.name} available at:` : ''"
    :no-fade="true"
    :hide-footer="true"
    scrollable
    :body-class="'p-none'"
    size="md"
  >
    <table class="table" v-if="service">
      <tr v-for="(idx,key) in serviceAvailability">
        <th>
          {{regionTitle(key)}}
          <br/>
          <span class="text-black-50">
            ({{key}})
          </span>
        </th>
        <td>
          <span class="region-availability"
                :class="computeAvailabilityClass(service.availability[key])"
          >&nbsp;</span>
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
    computeAvailabilityClass: function(av) {
      if (av.inGA) {
        return 'region-availability-ga'
      } else if (av.inPreview) {
        return 'region-availability-preview'
      } else if (av.expectation) {
        return 'region-availability-expected'
      }
      return ''
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
