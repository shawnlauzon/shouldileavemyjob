<template>
  <v-card class="text-h2 pa-12 elevation-0">
    <v-container>
      <v-row justify="center"><slot /></v-row>
      <v-row justify="center" class="py-15">
        <v-slider
          :value="value"
          min="0"
          max="10"
          :tick-labels="labels"
          ,
          @change="$emit('input', $event)"
        />
      </v-row>
    </v-container>
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
