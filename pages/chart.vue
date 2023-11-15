<template>
  <v-app>
    <v-main>
      <img :src="image" />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      image: null,
    }
  },
  async fetch() {
    if ($route.query.id) {
      this.image = await this.$http.$get(
        '/api/get-chart?id=' + parseInt($route.query.id)
      )
    } else if ($route.query.user_id) {
      this.image = await this.$http.$get(
        '/api/get-chart?user_id=' + parseInt($route.query.user_id)
      )
    }
  },
}
</script>
