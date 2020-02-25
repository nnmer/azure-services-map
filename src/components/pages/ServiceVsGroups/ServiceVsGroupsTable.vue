<template>
  <div class="service-list-container data-container-table">
    <div class="service-list scrollable row text-center m-none">
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
        >
          <div class="service-list-col-service-item">
            <div
              class="pull-left"
            >
              <a v-if="serviceHasAvailability(service)"
                 href="#"
                 class="action-icon"
                 @click.stop="$root.$emit('app::services::region-availability-modal::show', $event, service.id)"
              >
                <img src="/img/globe.png" width="16px"/>
              </a>
            </div>

            <div
              class="pull-right"
            >
              <a href="#" 
                class="action-icon"
                v-bind:id="`humb-menucat-${catIdx}-${service.id}`"
                @click.capture="$root.$emit('app::services::popover::show', $event, service.id, `humb-menucat-${catIdx}-${service.id}`)"
              >
                <img src="/img/icon_humb.svg" width="16px"/>
              </a>
            </div>
            <div class="clearfix"/>


            <div class="m-t-7">
              <img class="service-icon" v-bind:src="service.icon || 'img/icon-azure-black-default.png'"/>
              <div
                v-bind:class="{'service-title':true,'has-linking-services':service.servicesIO.input && service.servicesIO.input.length >0
                || service.servicesIO.output && service.servicesIO.output.length >0}"
              >
              {{service.name}}
              </div>
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
    serviceHasAvailability: (service) => {
      return service.hasOwnProperty('availability') && Object.keys(service.availability).length > 0
    }
  }
}
</script>
