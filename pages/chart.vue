<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>
    <v-main>
      <img v-if="image" :src="image" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      image: undefined as string | undefined,
    }
  },
  async fetch() {
    if (this.$route.query.id) {
      const base64Img = await this.$http.$get(
        '/api/get-chart-image?id=' + this.$route.query.id
      )
      this.image = 'data:image/png;base64, ' + base64Img
    } else if (this.$route.query.user_id) {
      this.image =
        'data:image/png;base64, ' +
        (await this.$http.$get(
          '/api/get-chart-image?user_id=' + this.$route.query.user_id
        ))
    }
  },
})
</script>
