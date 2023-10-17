<template>
  <v-card height="6em" class="text-h2 py-6 elevation-0">
    <div class="pa-12"><slot /></div>
    <v-slider
      :value="value"
      min="0"
      max="10"
      :tick-labels="labels"
      ,
      @change="$emit('input', $event)"
    />
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
