<template>
  <v-card height="6em" class="text-h2 py-6 elevation-0">
    <div class="pa-12">One last thing.</div>
    <div class="body"></div>
    <v-text-field
      label="Email address"
      :value="value"
      @change="$emit('input', $event)"
    ></v-text-field>
    <v-checkbox
      value="value"
      :false-value="false"
      :true-value="true"
      row
      label="I agree to receive email. Your email address will not be shared or sold. Pinkie swear!"
      @change="$emit('agreed', $event)"
    />
  </v-card>
</template>

<script>
export default {
  props: {
    value: { type: String, default: null },
  },
  emit: ['agreed'],
}
</script>
