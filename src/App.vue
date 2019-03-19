<template>
  <div id="app">
    <DefaultLayout>
      <ServiceVsGroups/>
    </DefaultLayout>

    <ServicePopover/>
    <ServiceDirectIOModal/>
    <ServiceDirectedGraphModal/>
  </div>
</template>

<script>
import DefaultLayout from 'src/components/layouts/DefaultLayout'
import ServiceVsGroups from 'src/components/pages/ServiceVsGroups'
import ServicePopover from 'src/components/pages/ServiceVsGroups/ServicePopover'
import ServiceDirectIOModal from 'src/components/pages/ServiceVsGroups/ServiceDirectIOModal'
import ServiceDirectedGraphModal from 'src/components/pages/ServiceVsGroups/ServiceDirectedGraphModal'

export default {
  name: 'App',
  components: {
    DefaultLayout,
    ServiceVsGroups,
    ServicePopover,
    ServiceDirectIOModal,
    ServiceDirectedGraphModal
  },
  mounted: function() {
    // this.$root.$on('app::services::io-directed-graph::show', this.showIOFlowGraph)
  },
  // mounted: function() {
  //   let that = this;
  //   console.log(EventBus);
  //   EventBus.$on('click-at-page', function(data){
  //       alert('person deleted!!');
  //   });
  // },
}
</script>

<style lang="stylus">

</style>
