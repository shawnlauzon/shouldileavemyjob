<template>
  <v-container class="d-flex justify-center flex-column">
    <v-stepper v-model="questions[curQuestionIndex].step" class="elevation-0">
      <v-stepper-header class="elevation-0">
        <template v-for="q in numQuestions">
          <v-stepper-step
            :key="`${q}-question`"
            :complete="curQuestionIndex >= q"
            :step="q"
          ></v-stepper-step>
        </template>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="resistenceFrequency">
          <ScaleQuestion v-model="answers.resistenceFrequency">
            How often do you feel {{ keyIndicatorResistenceFeeling }}?
          </ScaleQuestion>
        </v-stepper-content>
        <v-stepper-content step="flowFrequency">
          <ScaleQuestion v-model="answers.flowFrequency">
            How often do you feel {{ keyIndicatorFlowFeeling }}?
          </ScaleQuestion>
        </v-stepper-content>
        <v-stepper-content step="selfEmployed">
          <YesNoQuestion v-model="answers.selfEmployed">
            Are you self-employed?
          </YesNoQuestion>
        </v-stepper-content>
        <v-stepper-content step="newJob">
          <YesNoQuestion v-model="answers.newJob">
            Do you have a new job ligned up?
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
        <v-stepper-content step="enterJobCorrectly">
          <YesNoQuestion v-model="answers.enterJobCorrectly">
            Did you {{ strategyText }} before starting your current job?
          </YesNoQuestion>
        </v-stepper-content>
        <v-stepper-content step="emailAddress">
          <EmailRequest v-model="emailAddress" @agreed="setEmailAgreed" />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-row class="d-flex justify-center">
      <v-btn class="mx-2" :disabled="!hasPrev" @click="prevStep()">
        Back
      </v-btn>
      <v-btn
        v-if="curQuestionIndex < questions.length - 1"
        class="mx-2"
        :disabled="!hasNext || curAnswer === undefined"
        color="primary"
        @click="nextStep()"
      >
        Next
      </v-btn>
      <v-btn
        v-else
        class="mx-2"
        :disabled="!emailAddress || !isEmailAgreed"
        color="primary"
        @click="complete()"
      >
        Finish
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    careerType: { type: String, default: 'classic builder' },
    interactionStyle: { type: String, default: 'respond before engaging' },
    keyIndicators: {
      type: Array,
      default: () => ['frustration', 'satisfaction'],
    },
    decisionMakingStrategy: {
      type: String,
      default: 'respond then follow your gut',
    },
    publicRole: { type: Array, default: () => ['pioneer', 'messenger'] },
    assimilatio: { type: String, default: 'independent' },
    traits: {
      type: Array,
      default: () => [
        '54.5',
        '53.5',
        '7.2',
        '10.1',
        '15.1',
        '54.6',
        '19.3',
        '27.5',
        '13.4',
        '15.2',
        '50.2',
        '9.4',
        '18.4',
        '51.3',
        '57.3',
        '50.5',
        '26.5',
        '45.5',
        '36.2',
        '55.2',
        '45.6',
        '37.2',
        '15.1',
        '32.6',
        '9.4',
        '18.2',
      ],
    },
  },
  data: function () {
    return {
      curQuestionIndex: 0,
      questions: [
        {
          step: 'resistenceFrequency',
          isVisible: () => {
            return true
          },
        },
        {
          step: 'flowFrequency',
          isVisible: () => {
            return true
          },
        },
        {
          step: 'selfEmployed',
          isVisible: () => {
            return true
          },
        },
        {
          step: 'enterJobCorrectly',
          isVisible: () => {
            return this.answerFor('selfEmployed') !== true
          },
        },
        {
          step: 'smallGroup',
          isVisible: () => {
            return this.answerFor('selfEmployed') !== true
          },
        },
        {
          step: 'largeGroup',
          isVisible: () => {
            return this.answerFor('selfEmployed') !== true
          },
        },
        {
          step: 'newJob',
          isVisible: () => {
            return this.publicRole.includes('influencer')
          },
        },
        {
          step: 'emailAddress',
          isVisible: () => {
            return true
          },
        },
      ],
      answers: {},
      emailAddress: undefined,
      isEmailAgreed: false,
      keyIndicatorFeelings: {
        frustration: 'frustrated',
        satisfaction: 'satisfied',
      },
      strategyTexts: {
        'respond then follow your gut': 'follow your gut',
      },
      pentaRoleStrengths: [
        ['31', '7'],
        ['8', '1'],
        ['33', '13'],
      ],
      pentaManagedStrengths: [
        ['15', '5'],
        ['2', '14'],
        ['46', '29'],
      ],
      oc16Strengths: [
        ['50', '27'],
        ['59', '6'],
        ['60', '3'],
        ['14', '2'],
        ['25', '51'],
        ['21', '45'],
      ],
    }
  },
  computed: {
    hasPrev() {
      return this.curQuestionIndex > 0
    },
    hasNext() {
      return this.curQuestionIndex < this.numQuestions - 1
    },
    curQuestion() {
      return this.questions[this.curQuestionIndex]
    },
    curAnswer() {
      return this.answers[this.questions[this.curQuestionIndex].step]
    },
    numQuestions() {
      return this.questions.reduce((a, v) => a + (v.isVisible() ? 1 : 0), 1)
    },
    traitsWithoutQualities() {
      return this.traits.map((orig) =>
        orig.indexOf(1) === '.' ? orig.substring(0, 1) : orig.substring(0, 2)
      )
    },
    keyIndicatorResistenceFeeling() {
      return this.keyIndicatorFeelings[this.keyIndicators[0]]
    },
    keyIndicatorFlowFeeling() {
      return this.keyIndicatorFeelings[this.keyIndicators[1]]
    },
    strategyText() {
      return this.strategyTexts[this.decisionMakingStrategy].toLowerCase()
    },
    hasPentaRoleStrengths() {
      return this.pentaRoleStrengths.reduce(
        (a, v) => !!((this.hasTrait(v[0]) && this.hasTrait(v[1])) || a),
        false
      )
    },
    hasPentaManagedStrengths() {
      return this.pentaManagedStrengths.reduce(
        (a, v) => !!((this.hasTrait(v[0]) && this.hasTrait(v[1])) || a),
        false
      )
    },
    hasOc16Strengths() {
      return this.oc16Strengths.reduce(
        (a, v) => !!((this.hasTrait(v[0]) && this.hasTrait(v[1])) || a),
        false
      )
    },
  },
  methods: {
    handleNext: function () {},
    nextStep: function () {
      if (this.hasNext) {
        this.curQuestionIndex++
        while (!this.curQuestion.isVisible()) {
          this.curQuestionIndex++
        }
      }
    },
    prevStep: function () {
      if (this.hasPrev) {
        this.curQuestionIndex--
        while (!this.curQuestion.isVisible()) {
          this.curQuestionIndex--
        }
      }
    },
    answerFor: function (q) {
      return this.answers[q]
    },
    hasTrait: function (n) {
      return this.traitsWithoutQualities.includes(n)
    },
    setEmailAgreed: function (v) {
      this.isEmailAgreed = v
    },
    complete: function () {},
  },
}
</script>
