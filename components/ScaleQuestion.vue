<template>
  <v-card
    class="text-h4 text-md-h2 elevation-0 d-flex flex-column"
    color="transparent"
  >
    <div>
      <slot />
    </div>
    <v-slider
      class="py-8"
      :value="value"
      min="0"
      max="10"
      :tick-labels="labels"
      @change="$emit('input', $event)"
    />
  </v-card>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: { type: Number, default: 5 },
  },
  data: function () {
    return {
      labels: ['Never', '', '', '', '', '', '', '', '', '', 'Always'],
    }
  },
})
</script>
