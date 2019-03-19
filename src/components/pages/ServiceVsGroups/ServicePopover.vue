<template>
  <b-popover
    v-if="service && elementTargetSelectorId"
    :id="'popover-'+elementTargetSelectorId"
    :target="elementTargetSelectorId"
    :title="service.name"
    triggers="click focus"
  >
  <ul class="list-unstyled">
    <li>
      <a v-bind:href="service.url" target="_blank">
        Docs
      </a>
    </li>
    <li v-if="(service.servicesIO.input && service.servicesIO.input.length > 0
        || service.servicesIO.output && service.servicesIO.output.length > 0 )">
      <a href="#"
        @click="$root.$emit('app::services::direct-io-modal::show', $event, service.id)"
        >
        Show Direct In/Out connections
      </a>
    </li>

    <li v-if="(service.servicesIO.output && service.servicesIO.output.length > 0)">
      <a href="#"
        @click="$root.$emit('app::services::io-directed-graph-modal::show', $event, service.id)"
        >
        Show IO tree
      </a>
    </li>
  </ul>
  </b-popover>
</template>

<script>
export default {
  name: 'ServicePopover',
  data: function () {
    return {
      elementTargetSelectorId: null,
      service: null
    }
  },
  created: function() {
    this.$root.$on('app::services::popover::show', this.togglePopover)
  },
  methods: {
    togglePopover: function (event, serviceId, targetSelector) {
      let that = this

      this.service = null
      this.elementTargetSelectorId = null

      this.$nextTick( function(){
        that.service = SL.services[serviceId]
        that.elementTargetSelectorId = targetSelector
      })

    }
  }
}
</script>
