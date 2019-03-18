<template>
  <div class="container services-direct-io-list">
    <div class="row">
      <div class="col" v-if="service.servicesIO.input && service.servicesIO.input.length > 0">
        <div class="list-group">
          <div class="list-group-item bg-primary listIOtitle text-center text-bold">
            To: {{service.name}}<br/>
            <img src="img/arrow-down.png" width="35px" style="transform: rotate(180deg);">
          </div>

            <div class="list-group-item"
              v-for="(item) in service.servicesIO.input">

                <div v-if="hasService(item)">
                  <img
                    v-if="SL(item).icon"
                    class="service-icon" :src="SL(item).icon"/>

                  {{SL(item).name}}
                  (<a :href="SL(item).url" target="_blank">docs</a>)
                </div>
                <div v-else>
                  {{item}}
                </div>
            </div>

          </div>
      </div>

      <div class="col" v-if="service.servicesIO.output && service.servicesIO.output.length > 0">
        <div class="list-group">
            <div class="list-group-item bg-success listIOtitle text-center text-bold">
              From: {{service.name}}<br/>
              <img src="img/arrow-down.png" width="35px">
            </div>

            <div class="list-group-item"
              v-for="(item) in service.servicesIO.output">

              <div v-if="hasService(item)">
                <img
                  v-if="SL(item).icon"
                  class="service-icon" :src="SL(item).icon"/>

                {{SL(item).name}}
                (<a :href="SL(item).url" target="_blank">docs</a>)
              </div>
              <div v-else>
                {{item}}
              </div>
            </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "ServiceDirectIOModalContent",
  props: [
    'service'
  ],
  methods: {
    SL: function(item) {
      return SL.services[item]
    },
    hasService: function (item) {
      return SL.services[item] || null
    }
  }
}
</script>
