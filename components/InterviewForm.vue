<!-- eslint-disable no-multi-str -->
<template>
  <v-container class="d-flex justify-center flex-column">
    <v-stepper
      v-model="questions[curQuestionIndex].step"
      class="flex-grow-1"
      elevation="0"
      :style="{ background: 'transparent' }"
    >
      <v-stepper-header class="elevation-0 flex-nowrap">
        <template v-for="q in questions">
          <v-stepper-step
            v-if="q.isVisible()"
            :key="q.step"
            class="pa-0"
            :complete="answers[q.step] !== undefined"
            step=""
          />
        </template>
      </v-stepper-header>
      <v-stepper-items class="py-md-10">
        <v-stepper-content step="resistenceFrequency" class="pa-2">
          <ScaleQuestion v-model="answers.resistenceFrequency">
            How often do you feel {{ keyIndicatorResistenceFeeling }}?
          </ScaleQuestion>
        </v-stepper-content>
        <v-stepper-content step="flowFrequency" class="pa-2">
          <ScaleQuestion v-model="answers.flowFrequency">
            How often do you feel {{ keyIndicatorFlowFeeling }}?
          </ScaleQuestion>
        </v-stepper-content>
        <v-stepper-content step="selfEmployed" class="pa-2">
          <YesNoQuestion v-model="answers.selfEmployed">
            Are you self-employed?
          </YesNoQuestion>
        </v-stepper-content>
        <v-stepper-content step="collaboration" class="pa-2">
          <MultipleChoiceQuestion
            v-model="answers.collaboration"
            :choices="[
              'I\'m a solopreneur or freelancer.',
              'I have a partner I usually work with.',
              'I work on a small team.',
              'I work with a large variety of people.',
            ]"
          >
            How would you best describe how you work?
          </MultipleChoiceQuestion>
        </v-stepper-content>
        <v-stepper-content step="interaction" class="pa-2">
          <MultipleChoiceQuestion
            v-model="answers.interaction"
            :choices="[
              'Usually I\'m by myself.',
              'Usually I\'m with one other person.',
              'Usually I\'m with a group of people.',
            ]"
          >
            And how do you interact with others?
          </MultipleChoiceQuestion>
        </v-stepper-content>
        <!-- <v-stepper-content step="largeGroup" class="pa-2">
          <YesNoQuestion v-model="answers.largeGroup">
            Do you work at a company greater than 10 people?
          </YesNoQuestion>
        </v-stepper-content> -->
        <!-- <v-stepper-content step="workFromHome" class="pa-2">
          <YesNoQuestion v-model="answers.workFromHome">
            Do you typically work from home?
          </YesNoQuestion>
        </v-stepper-content>
        <v-stepper-content step="smallGroup" class="pa-2">
          <YesNoQuestion v-model="answers.smallGroup">
            Do you frequently work <em>in-person</em> with 3-6 people?
          </YesNoQuestion>
        </v-stepper-content>
        <v-stepper-content step="partner" class="pa-2">
          <YesNoQuestion v-model="answers.partner">
            Do you frequently work <em>in-person</em> with someone else?
          </YesNoQuestion>
        </v-stepper-content> -->
        <!-- <v-stepper-content step="enterJobCorrectly" class="pa-2">
          <YesNoQuestion v-model="answers.enterJobCorrectly">
            Did you {{ strategyText }} before accepting your current job?
          </YesNoQuestion>
        </v-stepper-content> -->
        <v-stepper-content step="haveBoss" class="pa-2">
          <YesNoQuestion v-model="answers.haveBoss">
            Do you have a hands-on boss?
          </YesNoQuestion>
        </v-stepper-content>
        <v-stepper-content step="newJob" class="pa-2">
          <YesNoQuestion v-model="answers.newJob">
            Do you have a new job ligned up?
          </YesNoQuestion>
        </v-stepper-content>
        <v-stepper-content step="emailAddress" class="pa-2">
          <EmailRequest @agreed="setEmailAgreed" @user="setUser" />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-row class="d-flex justify-center flex-grow-1">
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
        :disabled="!user?.email || !isEmailAgreed"
        :loading="isStoring"
        color="primary"
        @click="complete()"
      >
        Finish
      </v-btn>
    </v-row>
  </v-container>
</template>

<script type="ts">
import { defineComponent } from 'vue'

const keyIndicatorFeelings = {
  Frustration: 'frustrated',
  Satisfaction: 'satisfied',
  Bitterness: 'bitter',
  Success: 'successful',
  Anger: 'angry',
  Peace: 'peaceful',
  Disappointment: 'disappointed',
  Surprise: 'surprised',
}
const pentaRoleStrengths = [
  ['31', '7'],
  ['8', '1'],
  ['33', '13'],
]
const pentaManagedStrengths = [
  ['15', '5'],
  ['2', '14'],
  ['46', '29'],
]
const oc16Strengths = [
  ['50', '27'],
  ['59', '6'],
  ['60', '3'],
  ['14', '2'],
  ['25', '51'],
  ['21', '45'],
]
export default defineComponent({
  props: {
    careerType: { type: String, default: 'Classic Builder' },
    interactionStyle: { type: String, default: 'Respond before Engaging' },
    keyIndicators: {
      type: Array,
      default: () => ['Frustration', 'Satisfaction'],
    },
    decisionMakingStrategy: {
      type: String,
      default: 'Respond then Follow Your Gut',
    },
    publicRole: { type: Array, default: () => ['Pioneer', 'Messenger'] },
    assimilation: { type: String, default: 'Independent' },
    traits: {
      type: Array,
      default: () => [],
    },
    userId: { type: Number, default: 0 },
  },
  data: function () {
    return {
      curQuestionIndex: 0,
      answers: {},
      user: undefined,
      isEmailAgreed: false,
      isStoring: false,
      questions: [
        {
          step: 'resistenceFrequency',
          isVisible: () => true,
        },
        {
          step: 'flowFrequency',
          isVisible: () => true,
        },
        {
          step: 'collaboration',
          isVisible: () => true,
        },
        {
          step: 'interaction',
          isVisible: () => true,
        },
        // {
        //   step: 'enterJobCorrectly',
        //   isVisible: () => {
        //     return this.answerFor('selfEmployed') === false
        //   },
        //   results: [
        //     {
        //       check: (ans) => ans > 7,
        //       update: (ans) => ans,
        //       msg: `${this.keyIndicators[1]} is your sign that you're doing things in alignment with
        //       your design, and the fact that you're feeling this quite often means something is going
        //       well with your job.`
        //     },
        //     {
        //       check: (ans) => ans === false,
        //       update: () => -2,
        //       msg: `It is always best to make decisions according to your Decision-Making Strategy,
        //       which for you is ${this.decisionMakingStrategy}. That you didn't do this doesn't mean
        //       you should leave your job right away, but if other things aren't going well, it provides
        //       support for making a job shift.`
        //     }
        //   ]
        // },
        // {
        //   step: 'largeGroup',
        //   isVisible: () => {
        //     return this.answerFor('selfEmployed') === false
        //   },
        //   results: [
        //     {
        //       check: (ans) => ans === true && this.hasOc16Strengths,
        //       update: () => 5,
        //       msg: `You have genetic blueprints that work well in a large \
        //       group, as you are in. In fact, you have one of the strengths which is ideal for
        //       being the `,
        //     },
        //   ]
        // },
        {
          step: 'selfEmployed',
          isVisible: () => true,
        },
        {
          step: 'haveBoss',
          isVisible: () =>
            this.answerFor('selfEmployed') === false && this.hatesBeingManaged,
        },
        {
          step: 'newJob',
          isVisible: () =>
            this.answerFor('selfEmployed') === false &&
            this.publicRole.includes('Influencer') === true,
        },
        {
          step: 'emailAddress',
          isVisible: () => true,
          results: [],
        },
      ],
    }
  },
  computed: {
    hasPrev() {
      return this.curQuestionIndex > 0
    },
    hasNext() {
      return this.curQuestionIndex < this.questions.length
    },
    curQuestion() {
      return this.questions[this.curQuestionIndex]
    },
    curAnswer() {
      return this.answers[this.questions[this.curQuestionIndex].step]
    },
    //   questions() {
    // return this.questions.reduce((a, v) => a + (v.isVisible() ? 1 : 0), 0)
    //   }
    // },
    traitsWithoutQualities() {
      return this.traits.map((orig) => orig.split('.')[0])
    },
    keyIndicatorResistenceFeeling() {
      return keyIndicatorFeelings[this.keyIndicators[0]]
    },
    keyIndicatorFlowFeeling() {
      return keyIndicatorFeelings[this.keyIndicators[1]]
    },
    hasPentaRoleStrengths() {
      return pentaRoleStrengths.reduce(
        (a, v) =>
          !!(
            (this.traitsWithoutQualities.includes(v[0]) &&
              this.traitsWithoutQualities.includes(v[1])) ||
            a
          ),
        false
      )
    },
    hasPentaManagedStrengths() {
      return pentaManagedStrengths.reduce(
        (a, v) =>
          !!(
            (this.traitsWithoutQualities.includes(v[0]) &&
              this.traitsWithoutQualities.includes(v[1])) ||
            a
          ),
        false
      )
    },
    hasOc16Strengths() {
      return oc16Strengths.reduce(
        (a, v) =>
          !!(
            (this.traitsWithoutQualities.includes(v[0]) &&
              this.traitsWithoutQualities.includes(v[1])) ||
            a
          ),
        false
      )
    },
    hatesBeingManaged() {
      return (
        this.traitsWithoutQualities.includes('45') ||
        this.traitsWithoutQualities.includes('21')
      )
    },
  },
  mounted() {
    this.$plausible.trackPageview({
      url: '/views/interview',
    })
  },
  methods: {
    handleNext: function () {},
    nextStep: function () {
      if (this.hasNext) {
        this.curQuestionIndex++
        while (!this.curQuestion.isVisible()) {
          this.curQuestionIndex++
        }
        this.$emit('input', this.conclusion)
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
    setUser(user) {
      this.user = user
    },
    setEmailAgreed: function (v) {
      this.isEmailAgreed = v
    },
    complete: async function () {
      try {
        this.isStoring = true
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Accept', 'application/json; q=0.01')

        this.user.id = this.userId

        const storeUser = await fetch('/api/store-user', {
          method: 'POST',
          headers,
          body: JSON.stringify(this.user),
        })
        // await storeUserResp.json()
        // console.log('User updated')

        const storeInterviewAndEmail = await fetch(
          '/api/store-and-email-interview',
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              userId: this.userId,
              firstName: this.user.firstName,
              email: this.user.email,
              answers: JSON.stringify(this.answers),
              conclusion: JSON.stringify(this.conclusion),
            }),
          }
        )

        const responses = await Promise.all([storeUser, storeInterviewAndEmail])

        this.$emit('complete', responses[1])
      } catch (e) {
        console.log('Failed to update user', e)
      }
      this.isStoring = false
    },
  },
})
</script>
