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
      image: null,
    }
  },
  fetch: async function () {
    if (this.$route.query.id) {
      this.image = await this.$http.$get(
        '/api/get-chart?id=' + this.$route.query.id
      )
    } else if (this.$route.query.user_id) {
      this.image = await this.$http.$get(
        '/api/get-chart?user_id=' + this.$route.query.user_id
      )
    }
  },
})
</script>
