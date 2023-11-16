<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <v-main>
      <ConclusionView :interview-id="parseInt($route.query.id)" />
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light'
    },
  },
})
</script>
