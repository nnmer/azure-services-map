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
            class="service-list-col-service-item"
            v-bind:class="{'has-linking-services':service.servicesIO.input && service.servicesIO.input.length >0
            || service.servicesIO.output && service.servicesIO.output.length >0}"
            v-bind:data-service-id="service.id"
            v-bind:id="catIdx+'-'+service.id"
            v-on:click.stop="clickOnServiceBox(service.id)"

        >
        <!-- v-on:click="showServiceTooltip(service.id, catIdx+'-'+service.id)" -->
          <div>
            <img class="service-icon" v-bind:src="service.icon"/>
            <br/>
            {{service.name}}
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
                data-toggle="modal"
                data-target="#direct-io-out-services-modal"
                v-bind:data-service-id="service.id"
                >
                Show Direct In/Out connections
              </a>
            </li>

            <li v-if="(service.servicesIO.output && service.servicesIO.output.length > 0)">
              <a href="#"
                data-toggle="modal"
                data-target="#io-out-service-tree-modal"
                v-bind:data-service-id="service.id"
                >
                Show IO tree
              </a>
            </li>
          </ul>
          </b-popover>
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
