<template>
  <div class="service-list-container">
    <div class="svg-container">
      <div :id="selectorId" ></div>
    </div>
    <D3LayoutHelpBox/>
  </div>
</template>

<script>
import D3LayoutHelpBox from 'src/components/_components/D3LayoutHelpBox'

export default {
  name: 'ServicesVsGroupsForcedTree',
  components: {
    D3LayoutHelpBox
  },
  props: [
    'selectorId'
  ]
}
</script>
