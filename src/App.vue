<template>
  <div id="app" @click="$root.$emit('click::at::page')">
    <DefaultLayout>

      <script type='text/html' id="direct_io_out_services_modal_tpl">
          <div class="container">
            <div class="row">
              <% if (servicesIO.input && servicesIO.input.length >0 ) { %>
                <div class="col">
                  <div class="list-group">
                    <div class="list-group-item list-group-item-action bg-primary listIOtitle text-center text-bold">
                      To: <%=name%><br/>
                      <img src="img/arrow-down.png" width="35px" style="transform: rotate(180deg);">
                    </div>

                      <% for (var i =0; i < servicesIO.input.length; i++) { %>
                        <span class="list-group-item list-group-item-action">
                            <% if (SL.services[servicesIO.input[i]]) { %>
                              <% if (SL.services[servicesIO.input[i]].icon) { %>
                                <img class="service-icon" src="<%=SL.services[servicesIO.input[i]].icon%>"/>
                              <% } %>
                              <%=SL.services[servicesIO.input[i]].name%>
                              (<a href="<%=SL.services[servicesIO.input[i]].url%>" target="_blank">docs</a>)
                            <% } else { %>
                              <%=servicesIO.input[i]%>
                            <% } %>
                        </span>
                      <% } %>
                    </div>
                </div>
              <% } %>

              <% if (servicesIO.output && servicesIO.output.length >0 ) { %>
                <div class="col">
                  <div class="list-group">
                      <div class="list-group-item list-group-item-action bg-success listIOtitle text-center text-bold">
                          From: <%=name%><br/>
                          <img src="img/arrow-down.png" width="35px">
                        </div>

                      <% for (var i =0; i < servicesIO.output.length; i++) { %>
                        <span class="list-group-item list-group-item-action">
                          <% if (SL.services[servicesIO.output[i]]) { %>
                            <% if (SL.services[servicesIO.output[i]].icon) { %>
                              <img class="service-icon" src="<%=SL.services[servicesIO.output[i]].icon%>"/>
                            <% } %>
                            <%=SL.services[servicesIO.output[i]].name%>
                            (<a href="<%=SL.services[servicesIO.output[i]].url%>" target="_blank">docs</a>)
                          <% } else { %>
                            <%=servicesIO.output[i]%>
                          <% } %>
                        </span>
                      <% } %>
                  </div>
                </div>
              <% } %>
            </div>
          </div>
        </script>

      <div class="modal" id="direct-io-out-services-modal" tabindex="-1" aria-labelledby="direct-io-out-services-modal" role="dialog"  aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalScrollableTitle">Service direct input/output connections </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body"> </div>
            </div>
        </div>
      </div>

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
                          <img src="img/drag.png" class="drag-icon" data-toggle="tooltip" data-placement="top" title="Click and drag canvas">
                          <img src="img/scroll.png" class="scroll-icon" data-toggle="tooltip" data-placement="top" title="Scroll to zoom Up/Down">
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
