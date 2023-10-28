<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>
    <v-main>
      <v-container>
        <ConclusionView :interview-id="parseInt($route.query.id)" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {}
</script>
