<template>
  <div>
    <div class="container-fluid">
      <div class="text-center">
        <div class="node-notes">
        </div>
      </div>

      <div class="clearfix"></div>
    </div>
    <div>
      <div class="svg-container">
        <div class="service-flow-action-icons text-right">
          <img src="img/drag.png" class="drag-icon" v-b-tooltip.hover title="Click and drag canvas">
          <img src="img/scroll.png" class="scroll-icon" v-b-tooltip.hover title="Scroll to zoom Up/Down">
        </div>
        <div id="service-vs-group-map" ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServicesVsGroupsForcedTree'
}
</script>
