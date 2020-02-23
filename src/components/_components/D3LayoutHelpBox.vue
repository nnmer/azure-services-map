<template>
  <div class="service-flow-action-icons text-right">
    <img src="/img/drag.png" class="drag-icon" v-b-tooltip.hover title="Click and drag canvas">
    <img src="/img/scroll.png" class="scroll-icon" v-b-tooltip.hover title="Scroll to zoom Up/Down">
  </div>
</template>

<script>
export default {
  name: 'D3LayoutHelpBox'
}
</script>
