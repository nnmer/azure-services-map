<template>
  <b-modal
    id="service-direct-io-modal"
    title="Direct Input/Output connections"
    size="lg"
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
      this.service = SL.services[serviceId] || null
      if (!this.service) {
        console.warn('Service is NULL, skip init modal')
        return      
      }
      this.$root.$emit('bv::show::modal', 'service-direct-io-modal', event)
    },
  }
}
</script>
