<template>
  <v-card
    class="text-h4 text-md-h2 elevation-0 d-flex flex-column"
    color="transparent"
  >
    <div>
      <slot />
    </div>
    <div class="d-inline-flex justify-center py-4">
      <v-radio-group column @change="$emit('input', $event)">
        <template v-for="(c, idx) in choices">
          <v-radio :key="idx" :label="c" :value="idx" />
        </template>
      </v-radio-group>
    </div>
  </v-card>
</template>

<script type="ts">
export default {
  props: {
    value: { type: Number, default: null },
    choices: { type: Array, required: true },
  },
  data: function () {
    return {}
  },
}
</script>
