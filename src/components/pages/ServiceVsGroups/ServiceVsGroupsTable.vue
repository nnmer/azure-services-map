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

        >
        <!-- v-on:click="showServiceTooltip(service.id, catIdx+'-'+service.id)" -->
          <div>
            <img class="service-icon" v-bind:src="service.icon"/>
            <br/>
            {{service.name}}
          </div>
        </div>
        <b-popover
          target="catIdx+'-'+service.id"
          title="Prop Examples"
          triggers="hover focus"
          content="Embedding content using properties is easy"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServicesVsGroupsTable',
  props: [
    'filteredServicesList'
  ]
}
</script>
