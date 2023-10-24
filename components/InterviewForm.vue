<!-- eslint-disable no-multi-str -->
<template>
  <v-container class="d-flex justify-center flex-column">
    <v-stepper
      v-model="questions[curQuestionIndex].step"
      class="elevation-0 flex-grow-1"
    >
      <v-stepper-header class="elevation-0 flex-nowrap">
        <template v-for="q in questions">
          <v-stepper-step
            v-if="q.isVisible()"
            :key="q.step"
            class="pa-0"
            :complete="answers[q.step] !== undefined"
            step=""
          >
          </v-stepper-step>
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
        <v-stepper-content step="newJob" class="pa-2">
          <YesNoQuestion v-model="answers.newJob">
            Do you have a new job ligned up?
          </YesNoQuestion>
        </v-stepper-content>
        <v-stepper-content step="largeGroup" class="pa-2">
          <YesNoQuestion v-model="answers.largeGroup">
            Do you work at a company greater than 10 people?
          </YesNoQuestion>
        </v-stepper-content>
        <v-stepper-content step="workFromHome" class="pa-2">
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
        </v-stepper-content>
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

<script>
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

export default {
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
    userId: { type: Number, required: true },
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
          results: [
            {
              check: (ans) => ans > 7,
              update: (acc, ans) =>
                acc.update(
                  -ans,
                  `${this.keyIndicators[0]} is your sign that you're doing things in contrast to
              your design, and the fact that you feel that so often is a sign that
              something should change.`
                ),
            },
            {
              check: (ans) => ans <= 7 && ans > 4,
              update: (acc, ans) =>
                acc.update(
                  -ans,
                  `${this.keyIndicators[0]} is your sign that you're doing things in contrast to
              your design, and the fact that you feel that so often is a sign that
              something should change.`
                ),
            },
            {
              check: (ans) => ans <= 4,
              update: (acc, ans) =>
                acc.update(
                  10 - ans * 2,
                  `${this.keyIndicators[0]} is your sign that you're doing things in contrast to
              your design, and the fact that you rarely feel that is a sign that you're
              doing things right.`
                ),
            },
          ],
        },
        {
          step: 'flowFrequency',
          isVisible: () => true,
          results: [
            {
              check: (ans) => ans > 7,
              update: (acc, ans) =>
                acc.update(
                  ans * 2,
                  `${this.keyIndicators[1]} is your sign that you're doing things in alignment with
              your design, and the fact that you're feeling this quite often means something is going
              well with your job.`
                ),
            },
            {
              check: (ans) => ans <= 7 && ans > 4,
              update: (acc, ans) =>
                acc.update(
                  ans,
                  `${this.keyIndicators[1]} is your sign that you're doing things in alignment with
              your design, and the fact that you're feeling this feeling it at least sometimes is a
              positive sign, with room for improvement.`
                ),
            },
            {
              check: (ans) => ans < 4,
              update: (acc, ans) =>
                acc.update(
                  -(10 - ans * 2),
                  `${this.keyIndicators[1]} is your sign that you're doing things in alignment with
              your design, and the fact that this doesn't happen very often means some adjustments must
              be made either within your job or to get a new one.`
                ),
            },
          ],
        },
        {
          step: 'selfEmployed',
          isVisible: () => true,
          results: [
            {
              check: (ans) => ans === true && this.hatesBeingManaged,
              update: (acc) =>
                acc.update(
                  5,
                  `There are a few people in the world who are designed to not have a boss,\
              and you are one of them. You hate being told what to do, and so having a boss\
              is the worst. So, well done on working for yourself!`
                ),
            },
          ],
        },
        {
          step: 'workFromHome',
          isVisible: () =>
            ['Collaborative', 'Assimilation'].includes(this.assimilation),
          results: [
            {
              check: (ans) =>
                ans === true && this.assimilation === 'Collaborative',
              update: (acc) =>
                acc.update(
                  -3,
                  `You are designed to work and collaborate with others, and so working
              separately from other people can make you feel uncomfortable or incomplete.
              It would be ideal if you worked in partnership with someone else, but if that's
              not possible, you should work in a place with other people around, such as
              a coffee shop or a co-working space.`
                ),
            },
            {
              check: (ans) =>
                ans === true && this.assimilation === 'Assimilation',
              update: (acc) =>
                acc.update(
                  -5,
                  `You are designed to move around and work with a variety of people
              throughout the day, and so working from home by yourself can be a challenge for
              you. If you work in a large company, going into the office would be great for
              you.`
                ),
            },
          ],
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
        {
          step: 'smallGroup',
          isVisible: () => this.answerFor('selfEmployed') === false,
          results: [
            {
              check: (ans) => ans === true && this.hasPentaRoleStrengths,
              update: (acc) =>
                acc.update(
                  10,
                  `You have genetic blueprints that work well in a small
              group, as you are in. If you don't have a specific role yet, you
              should work towards having one.`
                ),
            },
            {
              check: (ans) =>
                ans === true &&
                this.hasPentaManagedStrengths &&
                !this.hasPentaRoleStrengths,
              update: (acc) =>
                acc.update(
                  5,
                  `You work in a small group and also have a genetic blueprints that work well in a small group,
              and so you are an asset to the group. However being managed may
              eventually be challenging for you.`
                ),
            },
            {
              check: (ans) =>
                ans === true &&
                !this.hasPentaManagedStrengths &&
                !this.hasPentaRoleStrengths,
              update: (acc) =>
                acc.update(
                  -7,
                  `You work in a small group but well never feel comfortable in such a configuration.`
                ),
            },
            {
              check: (ans) =>
                ans === true && this.assimilation === 'Collaborative',
              update: (acc) =>
                acc.update(
                  4,
                  `You are designed to work and collaborate with others, so working with others in
              a group is a good thing. `
                ),
            },
          ],
        },
        {
          step: 'partner',
          isVisible: () =>
            this.answerFor('selfEmployed') === false &&
            ['Collaborative', 'Assimilation'].includes(this.assimilation),
          results: [
            {
              check: (ans) =>
                ans === true && this.assimilation === 'Collaborative',
              update: (acc) =>
                acc.update(
                  10,
                  `You are designed to work and collaborate with others, so working
              with someone else is fantastic for you.`
                ),
            },
            {
              check: (ans) =>
                ans === true && this.assimilation === 'Assimilation',
              update: (acc) =>
                acc.update(
                  4,
                  `You are designed to work and collaborate with others, so working
              with someone else is fantastic for you. However you work best when you work with a variety of people,
              so make sure to allow that movement in your daily work.`
                ),
            },
          ],
        },
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
          step: 'haveBoss',
          isVisible: () =>
            this.answerFor('selfEmployed') === false && this.hatesBeingManaged,
          results: [
            {
              check: (ans) => ans === true && this.hatesBeingManaged,
              update: (acc) =>
                acc.update(
                  -5,
                  `You have a boss, which for many people can be a nice sense of security.\
              Unfortunately, you have a genetic design which hates to be told what to do. You \
              would be best to look for work where you can be your own boss.`
                ),
            },
          ],
        },
        {
          step: 'newJob',
          isVisible: () =>
            this.answerFor('selfEmployed') === false &&
            this.publicRole.includes('Influencer') === true,
          results: [
            {
              check: (ans) => ans === false,
              update: (acc, ans) => {
                acc.hasJobLinedUp = ans
                return acc
              },
            },
          ],
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
    conclusion: function () {
      const acc = {
        score: 0,
        hasJobLinedUp: undefined,
        findJobThroughNetwork: this.publicRole.includes('Influencer'),
        messages: [],
        deltas: [],
        update: function (delta, msg) {
          this.score += delta
          this.deltas.push(delta)
          this.messages.push(msg)
          return this
        },
      }
      const result = this.questions.reduce((acc, q) => {
        const answer = this.answers[q.step]
        q.results.reduce((acc, r) => {
          if (r.check(answer)) {
            r.update(acc, answer)
          }
          return acc
        }, acc)
        return acc
      }, acc)
      result.score = Math.max(0, acc.score)
      return result
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

        const storeInterview = await fetch('/api/store-interview', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            userId: this.userId,
            answers: JSON.stringify(this.answers),
            conclusion: JSON.stringify(this.conclusion),
          }),
        }).then(async (resp) => await resp.json())

        const responses = await Promise.all([storeUser, storeInterview])
        console.log('conclusion', responses[1])

        this.$emit('complete', responses[1])
      } catch (e) {
        console.warn('Failed to update user', e)
      }
      this.isStoring = false
    },
  },
}
</script>
