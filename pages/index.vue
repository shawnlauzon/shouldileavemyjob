<template>
  <v-app>
    <v-main>
      <v-container>
        <IntroText v-if="!isStarted" @click="isStarted = true" />
        <BirthDataForm v-if="isStarted && !hasDesign" v-model="design" />
        <InterviewForm
          v-if="hasDesign && !isComplete"
          v-bind="design"
          v-model="conclusion"
          @complete="handleComplete"
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
      design: undefined,
      conclusion: undefined,
      isComplete: false,
    }
  },
  computed: {
    hasDesign() {
      return this.design !== undefined
    },
  },
  methods: {
    handleComplete: function () {
      this.isComplete = true
    },
  },
}
</script>
