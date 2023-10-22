<template>
  <v-card class="text-h4 text-md-h2 elevation-0 d-flex flex-column">
    <div class="pb-4">One last thing.</div>
    <div class="text-body-1 pb-6">
      This quiz is only a start. We'd like to continue working with you to
      create a great life ... a life which is specifically for YOU, not anyone
      else.
    </div>
    <div class="text-body-1 pb-6">
      So if it's correct for you, enter your email address and we'll send you
      info which I think you'll like. Most of it specifically for you and your
      unique design. Cancel anytime.
    </div>
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
