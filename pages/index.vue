<template>
  <v-app>
    <v-main>
      <v-container>
        <IntroText v-if="!isStarted" @click="isStarted = true" />
        <BirthDataForm
          v-if="isStarted && !hasChart"
          @user="handleUser"
          @chart="handleChart"
        />
        <InterviewForm
          v-if="hasChart && !isComplete"
          v-bind="chart"
          v-model="conclusion"
          @email="handleEmail"
          @complete="handleInterviewComplete"
        />
        <ConclusionView v-if="isComplete" v-bind="conclusion" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: function () {
    return {
      isStarted: false,
      user: undefined,
      chart: undefined,
      conclusion: undefined,
      isComplete: false,
    }
  },
  computed: {
    hasChart() {
      return this.chart !== undefined
    },
  },
  methods: {
    handleUser: function (user) {
      this.user = user
    },
    handleChart: function (chart) {
      this.chart = chart
    },
    handleEmail: async function (email) {
      if (this.user) {
        try {
          const headers = new Headers()
          headers.append('Content-Type', 'application/json')
          headers.append('Accept', 'application/json; q=0.01')

          this.user.email = email
          const storeUserResp = await fetch('/api/store-user', {
            method: 'POST',
            headers,
            body: JSON.stringify(this.user),
          })
          await storeUserResp.json()
          console.log('User email updated')
        } catch (e) {
          console.warn('Failed to update email', e)
        }
      } else {
        console.warn('Not saving email; no user defined')
      }
    },
    handleInterviewComplete: function () {
      this.isComplete = true
    },
  },
}
</script>
