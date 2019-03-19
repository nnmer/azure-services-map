<template>
  <div class="service-list-container data-container-table">
    <div class="service-list row text-center m-none">
      <div
        :key="catIdx"
        class="service-list-col" v-for="(services, category, catIdx) in filteredServicesList" >
        <div class="service-list-col-title">
          {{category}}
        </div>
        <div :key="service.id"
            v-for="(service) in filteredServicesList[category]"
            v-bind:data-service-id="service.id"
            v-bind:id="catIdx+'-'+service.id"
            v-on:click.stop="clickOnServiceBox(service.id)"

        >
          <div class="service-list-col-service-item"
            @click="$root.$emit('app::services::popover::show', $event, service.id, catIdx+'-'+service.id)"
          >
            <img class="service-icon" v-bind:src="service.icon"/>
            <div
              v-bind:class="{'has-linking-services':service.servicesIO.input && service.servicesIO.input.length >0
              || service.servicesIO.output && service.servicesIO.output.length >0}"
            >
            {{service.name}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServicesVsGroupsTable',
  props: [
    'filteredServicesList'
  ],
  methods: {
    clickOnServiceBox: function (serviceId) {
      console.warn('clicked clickOnServiceBox')
      this.$root.$emit('click::at::page', serviceId)
    }
  }
}
</script>
