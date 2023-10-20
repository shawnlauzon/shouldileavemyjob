<template>
  <v-card class="text-h4 text-md-h2 elevation-0 d-inline-flex flex-column">
    <div>
      <slot />
    </div>
    <div class="d-inline-flex justify-center py-8">
      <v-radio-group :value="value" row @change="$emit('input', $event)">
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
