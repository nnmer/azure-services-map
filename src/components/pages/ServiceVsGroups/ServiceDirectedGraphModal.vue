<template>
  <b-modal
    id="services-io-directed-graph-modal"
    title="Services Input/Output flow"
    :no-fade="true"
    :hide-footer="true"
  >
    <div class="svg-container">
      <D3LayoutHelpBox/>
      <div :id="visualizationContainerId"></div>
    </div>
  </b-modal>
</template>

<script>
import D3LayoutHelpBox from 'src/components/_components/D3LayoutHelpBox'
import serviceFlowTree from 'src/_helpers/ServiceFlowTree'

export default {
  name: 'ServiceDirectedGraphModal',
  components: {
    D3LayoutHelpBox
  },
  data: function () {
    return {
      visualizationContainerId: 'service-flow',
      visualizationContainerSelector: '#service-flow',
    }
  },
  mounted: function() {
    this.$root.$on('app::services::io-directed-graph-modal::show', this.showIOFlowGraph)
  },
  methods: {
    showIOFlowGraph: function (event, serviceId) {
      this.$root.$emit('bv::show::modal', 'services-io-directed-graph-modal', event)
      this.showServiceIntegrationTree(serviceId, SL.services)
    },
    showServiceIntegrationTree: function(serviceId, services) {
      function buildChildren(id) {
        // console.warn('Called buildChildren',id)
        let service = services[id];
        let obj = {
          name: service ? service.name : id
        }
        circularRefTrack.push(id)

        if (service && service.servicesIO.output.length > 0){
          for (let i=0;i<service.servicesIO.output.length;i++){
            let servId = service.servicesIO.output[i];
            let depService = services[servId]
            let toInject = null;
            if (circularRefTrack.indexOf(servId) === -1 && depService) {
              toInject = buildChildren(servId)
            } else {
              toInject = {
                name: depService ? depService.name : servId
              }
              circularRefTrack.push(servId)
            }
            if (!obj.children){
              obj.children = []
            }
            obj.children.push(toInject)
            circularRefTrack.pop()
          }
        }

        return obj;
      }

      var circularRefTrack = [];
      $(this.visualizationContainerSelector).html('');
      let tree = buildChildren(serviceId)
      serviceFlowTree(this.visualizationContainerSelector, tree)
    }
  }
}
</script>
