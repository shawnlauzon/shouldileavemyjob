<template>
  <v-app>
    <v-main>
      <v-container>
        <!-- <IntroText v-if="!isStarted" @click="isStarted = true" />
        <BirthDataForm v-if="isStarted && !hasChart" @chart="saveChart" /> -->
        <InterviewForm
          v-if="hasChart && !isComplete"
          v-bind="chart"
          v-model="conclusion"
          @complete="handleInterviewComplete"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: function () {
    return {
      isStarted: false,
      chart: undefined,
      conclusion: undefined,
      isComplete: false,
    }
  },
  computed: {
    hasChart() {
      // return this.chart !== undefined
      return true
    },
  },
  methods: {
    saveChart: function (chart) {
      this.chart = chart
    },
    handleInterviewComplete: function () {
      this.$router.push('/check-your-email')
    },
  },
}
</script>
