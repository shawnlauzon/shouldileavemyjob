<template>
  <v-card
    class="text-h4 text-md-h2 mx-2 elevation-0 d-flex flex-column"
    color="transparent"
  >
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
    <div>
      <v-row>
        <v-text-field
          v-model="user.firstName"
          class="mx-2"
          label="First name"
          :rules="[rules.required]"
          @input="$emit('user', user)"
        ></v-text-field>
        <v-text-field
          v-model="user.lastName"
          class="ml-2"
          label="Last name"
          @input="$emit('user', user)"
        ></v-text-field>
      </v-row>
      <v-text-field
        v-model="user.email"
        label="Email address"
        :rules="[rules.required, rules.email]"
        :error-messages="errors"
        @input="$emit('user', user)"
      ></v-text-field>
      <v-checkbox
        v-model="isAgreed"
        :false-value="false"
        :true-value="true"
        :rules="[rules.required]"
        row
        label="I agree to receive email. Your email address will not be shared or sold. Pinkie swear!"
        @change="$emit('agreed', $event)"
      />
    </div>
  </v-card>
</template>

<script type="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      user: {
        firstName: undefined,
        lastName: undefined,
        email: undefined,
      },
      isAgreed: false,
      errors: [],
      isEmailUnique: true,
      rules: {
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },
    }
  },
  watch: {
    // Limit how often we validate the email
    'user.email'() {
      if (this.rules.email(this.user.email) === true && this.isAgreed) {
        this.validateUniqueEmail()
      }
    },
    isAgreed() {
      if (this.rules.email(this.user.email) === true && this.isAgreed) {
        this.validateUniqueEmail()
      }
    },
  },
  emit: ['agreed', 'user'],
  methods: {
    async validateUniqueEmail() {
      try {
        const res = await this.$http.get(encodeURI('/api/is-user-created?email=' + this.user.email))
          // OK in this case means the email was found, which is an error
          this.errors = res.ok ? ['Email in use.'] : []
      } catch (err) {
        console.log('got error', err)
        if (err.statusCode !== 404) {
          throw err;
        } else {
          this.errors = []
        }
      }
    },
  },
})
</script>
