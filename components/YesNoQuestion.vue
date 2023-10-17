<template>
  <v-card class="text-h2 pa-12 elevation-0">
    <v-container>
      <v-row justify="center"><slot /></v-row>
      <v-row justify="center" class="py-6">
        <v-radio-group value="value" row @change="$emit('input', $event)">
          <v-radio label="Yes" :value="true" />
          <v-radio label="No" :value="false" />
        </v-radio-group>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: { value: { type: Boolean, default: null } },
}
</script>
