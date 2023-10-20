<template>
  <v-card class="text-h4 text-md-h2 elevation-0">
    <div>
      <slot />
    </div>
    <v-slider class="py-8" :value="value" min="0" max="10" :tick-labels="labels" @change="$emit('input', $event)" />
  </v-card>
</template>

<script>
export default {
  props: {
    value: { type: Number, default: 5 },
  },
  data: function () {
    return {
      labels: [
        'Never',
        '',
        '',
        '',
        '',
        'Half the time',
        '',
        '',
        '',
        '',
        'All the time',
      ],
    }
  },
}
</script>
