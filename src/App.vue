<template>
  <div id="app">
    <DefaultLayout>
      <ServiceVsGroups/>
    </DefaultLayout>

    <ServicePopover/>
    <ServiceDirectIOModal/>
    <ServiceDirectedGraphModal/>
    <ServiceRegionAvailabilityModal/>
  </div>
</template>

<script>
import DefaultLayout from 'src/components/layouts/DefaultLayout'
import ServiceVsGroups from 'src/components/pages/ServiceVsGroups'
import ServicePopover from 'src/components/pages/ServiceVsGroups/ServicePopover'
import ServiceDirectIOModal from 'src/components/pages/ServiceVsGroups/ServiceDirectIOModal'
import ServiceDirectedGraphModal from 'src/components/pages/ServiceVsGroups/ServiceDirectedGraphModal'
import ServiceRegionAvailabilityModal from 'src/components/pages/ServiceVsGroups/ServiceRegionAvailabilityModal'

export default {
  name: 'App',
  components: {
    DefaultLayout,
    ServiceVsGroups,
    ServicePopover,
    ServiceDirectIOModal,
    ServiceDirectedGraphModal,
    ServiceRegionAvailabilityModal
  }
}
</script>

<style lang="stylus">

</style>
