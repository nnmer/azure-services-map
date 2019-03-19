<template>
  <div @click="$root.$emit('click::at::page')">
    <PageNavigation/>
    <slot/>
  </div>
</template>

<script>

import PageNavigation from 'src/components/page-blocks/PageNavigation.vue'

export default {
  name: 'DefaultLayout',
  components: {
    PageNavigation
  }
}
</script>
