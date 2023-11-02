<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <v-main>
      <IntroView v-if="!isStarted" @click="isStarted = true" />
      <BirthDataForm v-if="isStarted && !hasChart" @chart="saveChart" />
      <InterviewForm
        v-if="hasChart && !isComplete"
        v-bind="chart"
        v-model="conclusion"
        @complete="handleInterviewComplete"
      />
      <CheckEmailView v-if="isComplete" />
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
  head() {
    return {
      meta: [
        {
          hid: 'og-type',
          property: 'og:type',
          content: 'Should I leave my job?',
        },
        {
          hid: 'og-desc',
          property: 'og:description',
          content: `Not sure if your current job is for you? Take this fun quiz 
            which uses Human Design for Business to bring clarity to your dilemma.`,
        },
        {
          hid: 'og-image',
          property: 'og:image',
          content: 'https://shouldileavemyjob.com/woman-confused.jpg',
        },
        {
          hid: 'og-url',
          property: 'og:url',
          content: 'https://shouldileavemyjob.com',
        },
      ],
    }
  },
  computed: {
    hasChart() {
      return this.chart !== undefined
    },
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light'
    },
  },
  methods: {
    saveChart: function (chart) {
      this.chart = chart
    },
    handleInterviewComplete: function () {
      this.isComplete = true
    },
  },
}
</script>
