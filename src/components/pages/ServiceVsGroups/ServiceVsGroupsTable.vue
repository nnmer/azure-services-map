<template>
  <div class="service-list-container">
    <div class="service-list row text-center">
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
          <div class="service-list-col-service-item">
            <img class="service-icon" v-bind:src="service.icon"/>
            <div
              v-bind:class="{'has-linking-services':service.servicesIO.input && service.servicesIO.input.length >0
              || service.servicesIO.output && service.servicesIO.output.length >0}"
            >
            {{service.name}}
            </div>
          </div>
          <b-popover
            v-bind:target="catIdx+'-'+service.id"
            v-bind:title="service.name"
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
                v-b-modal="catIdx+'-'+service.id+'direct-io-modal'">
                Show Direct In/Out connections
              </a>
            </li>

            <li v-if="(service.servicesIO.output && service.servicesIO.output.length > 0)">
              <a href="#"
                v-bind:data-service-id="service.id"
                >
                Show IO tree
              </a>
            </li>
          </ul>
          </b-popover>

          <b-modal
            :id="catIdx+'-'+service.id+'direct-io-modal'"
            title="Direct Input/Output connections"
            size="lg"
            :no-fade="true"
            :lazy="true"
            :hide-footer="true"
            >
            <ServiceDirectIOModalContent
              v-bind:service="service"
            />
          </b-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceDirectIOModalContent from './ServiceDirectIOModalContent'

export default {
  name: 'ServicesVsGroupsTable',
  props: [
    'filteredServicesList'
  ],
  components: {
    ServiceDirectIOModalContent
  },
  methods: {
    clickOnServiceBox: function (serviceId) {
      console.warn('clicked clickOnServiceBox')
      this.$root.$emit('click::at::page', serviceId)
    }
  }
}
</script>
