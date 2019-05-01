<template>
  <b-modal
    id="service-direct-io-modal"
    title="Direct Input/Output connections"
    size="xl"
    :no-fade="true"
    :lazy="true"
    :hide-footer="true"
    >
    <ServiceDirectIOModalContent
      v-if="service"
      v-bind:service="service"
    />
  </b-modal>
</template>

<script>
import ServiceDirectIOModalContent from './ServiceDirectIOModalContent'

export default {
  name: 'ServiceDirectIOModal',
  components: {
    ServiceDirectIOModalContent
  },
  data: function () {
    return {
      service: null
    }
  },
  mounted: function() {
    this.$root.$on('app::services::direct-io-modal::show', this.showModal)
  },
  methods: {
    showModal: function (event, serviceId) {
      let that = this
      this.service = null

      this.$nextTick(function () {
        that.service = SL.services[serviceId] || null
        if (!this.service) {
          //console.warn('Service is NULL, skip init modal')
          return
        }
        that.$root.$emit('bv::show::modal', 'service-direct-io-modal', event)
      })
    }
  }
}
</script>
