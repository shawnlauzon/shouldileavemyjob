<template>
  <v-card
    class="text-h4 text-md-h2 elevation-0 d-flex flex-column"
    color="transparent"
  >
    <div>
      <slot />
    </div>
    <div class="d-inline-flex justify-center py-4">
      <v-radio-group :value="value" row @change="$emit('input', $event)">
        <v-radio :label="choices[0]" :value="true" />
        <v-radio :label="choices[1]" :value="false" />
      </v-radio-group>
    </div>
  </v-card>
</template>

<script type="ts">
export default {
  props: {
    value: { type: Boolean, default: null },
    choices: { type: Array, default: () => ['Yes', 'No'] },
  },
}
</script>
