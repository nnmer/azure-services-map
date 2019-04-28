<template>
  <div class="container services-direct-io-list p-none">
    <div class="text-center mb-3">
      <i>Connections are shown regardless selected Azure region</i>
    </div>
    <div class="row no-gutters">
      <div class="col" v-if="service.servicesIO.input && service.servicesIO.input.length > 0">
        <div class="list-group">
          <div class="list-group-item bg-primary listIOtitle text-center text-bold">
            <h5>To: {{service.name}}</h5>
            <img src="img/arrow-down.png" width="35px" style="transform: rotate(180deg);">
          </div>

          <ListServicesForDirectIO
            :dataSource="service.servicesIO.input"
          />

          </div>
      </div>

      <div class="col" v-if="service.servicesIO.output && service.servicesIO.output.length > 0">
        <div class="list-group">
            <div class="list-group-item bg-success listIOtitle text-center">
              <h5>From: {{service.name}}</h5>
              <img src="img/arrow-down.png" width="35px">
            </div>

            <ListServicesForDirectIO
              :dataSource="service.servicesIO.output"
            />

        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ListServicesForDirectIO from './components/ListServicesForDirectIO'

export default {
  name: 'ServiceDirectIOModalContent',
  props: {
    service: Object
  },
  components: {
    ListServicesForDirectIO
  }
}
</script>

<style>
.services-direct-io-list .col:first-child{
  padding-right: 15px
}
</style>
