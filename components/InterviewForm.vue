<template>
  <v-stepper v-model="questions[curQuestion]" class="elevation-0">
    <v-stepper-header class="elevation-0">
      <template v-for="q in numQuestions">
        <v-stepper-step
          :key="`${q}-question`"
          :complete="curQuestion > questions.length"
          step=""
        ></v-stepper-step>
      </template>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="resistenceFrequency">
        <ScaleQuestion v-model="answers.resistenceFrequency">
          How often do you feel {{ design.keyIndicatorFeelings[0] }}?
        </ScaleQuestion>
      </v-stepper-content>
      <v-stepper-content step="flowFrequency">
        <ScaleQuestion v-model="answers.flowFrequency">
          How often do you feel {{ design.keyIndicatorFeelings[1] }}?
        </ScaleQuestion>
      </v-stepper-content>
      <v-stepper-content step="newJob">
        <YesNoQuestion v-model="answers.newJob">
          Do you have a new job ligned up?"
        </YesNoQuestion>
      </v-stepper-content>
      <v-stepper-content step="selfEmployed">
        <YesNoQuestion v-model="answers.selfEmployed">
          Are you self-employed?
        </YesNoQuestion>
      </v-stepper-content>
      <v-stepper-content step="enterJobCorrectly">
        <YesNoQuestion v-model="answers.enterJobCorrectly">
          Did you {{ design.decisionMakingStrategy.toLowerCase() }} before
          starting your current job?
        </YesNoQuestion>
      </v-stepper-content>
      <v-stepper-content step="largeGroup">
        <YesNoQuestion v-model="answers.largeGroup">
          Do you work at a company greater than 10 people?
        </YesNoQuestion>
      </v-stepper-content>
      <v-stepper-content step="smallGroup">
        <YesNoQuestion v-model="answers.smallGroup">
          Do you frequently work <em>in-person</em> with 3-6 people?
        </YesNoQuestion>
      </v-stepper-content>
    </v-stepper-items>

    <v-btn :disabled="!hasPrev" @click="prevStep()"> Back </v-btn>
    <v-btn
      :disabled="!hasNext || answers[questions[curQuestion]] === undefined"
      color="primary"
      @click="nextStep()"
    >
      Next
    </v-btn>
  </v-stepper>
</template>

<script>
export default {
  props: {
    design: {
      type: Object,
      default: function () {
        return {
          careerType: 'Classic Builder',
          keyIndicators: ['frustration', 'satisfaction'],
          keyIndicatorFeelings: ['frustrated', 'satisfied'],
          decisionMakingStrategy: 'Check with your gut',
        }
      },
    },
  },
  data: function () {
    return {
      curQuestion: 0,
      questions: [
        'selfEmployed',
        'resistenceFrequency',
        'flowFrequency',
        'enterJobCorrectly',
        'smallGroup',
        'largeGroup',
      ],
      answers: {},
    }
  },
  computed: {
    // keyPositiveIndicator() {
    //   switch (this.careerType) {
    //     case 'Classic Builder':
    //     case 'Express Builder':
    //       return 'satisfaction'
    //   }
    // }
    numQuestions() {
      return this.questions.length
    },
    hasPentaStrengths() {
      return false
    },
    hasLargeBusinessStrengths() {
      return true
    },
    hasPrev() {
      return this.curQuestion > 0
    },
    hasNext() {
      return this.curQuestion < this.numQuestions - 1
    },
  },
  methods: {
    handleNext: function () {},
    nextStep: function () {
      if (this.hasNext) {
        this.curQuestion++
      }
    },
    prevStep: function () {
      if (this.hasPrev) {
        this.curQuestion--
      }
    },
  },
}
</script>
