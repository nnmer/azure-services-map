<template>
  <div id="app" @click="$root.$emit('click::at::page')">
    <DefaultLayout>


      <div class="modal modal-fullscreen" id="io-out-service-tree-modal" tabindex="-1" aria-labelledby="io-out-service-tree-modal" role="dialog"  aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalScrollableTitle">Service output connections tree </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="svg-container">
                      <div class="service-flow-action-icons text-right">
                          <img src="img/drag.png" class="drag-icon" v-b-tooltip.hover title="Click and drag canvas">
                          <img src="img/scroll.png" class="scroll-icon" v-b-tooltip.hover title="Scroll to zoom Up/Down">
                        </div>
                      <div id="service-flow"></div>

                    </div>
                </div>
            </div>
        </div>
      </div>

      <ServiceVsGroups/>
    </DefaultLayout>
  </div>
</template>

<script>
import DefaultLayout from 'src/components/layouts/DefaultLayout'
import ServiceVsGroups from 'src/components/pages/ServiceVsGroups'

export default {
  name: 'App',
  components: {
    DefaultLayout,
    ServiceVsGroups
  }
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
