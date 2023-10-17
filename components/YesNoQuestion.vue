<template>
  <v-card
    height="6em"
    class="text-h2 py-6 elevation-0 d-inline-flex flex-column"
  >
    <div class="pa-12"><slot /></div>
    <div class="d-inline-flex justify-center">
      <v-radio-group value="value" row @change="$emit('input', $event)">
        <v-radio label="Yes" :value="true" />
        <v-radio label="No" :value="false" />
      </v-radio-group>
    </div>
  </v-card>
</template>

<script>
export default {
  props: { value: { type: Boolean, default: null } },
}
</script>
