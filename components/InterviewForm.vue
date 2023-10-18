<!-- eslint-disable no-multi-str -->
<template>
  <v-container class="d-flex justify-center flex-column">
    <v-stepper v-model="questions[curQuestionIndex].step" class="elevation-0">
      <v-stepper-header class="elevation-0">
        <template v-for="q in questions">
          <v-stepper-step v-if="q.isVisible()" :key="q.step" :complete="answers[q.step] !== undefined" step="">
          </v-stepper-step>
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
        <v-stepper-content step="workFromHome">
          <YesNoQuestion v-model="answers.workFromHome">
            Do you typically work from home?
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
        <v-stepper-content step="haveBoss">
          <YesNoQuestion v-model="answers.haveBoss">
            Do you have a hands-on boss?
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
      <v-btn v-if="curQuestionIndex < questions.length - 1" class="mx-2" :disabled="!hasNext || curAnswer === undefined"
        color="primary" @click="nextStep()">
        Next
      </v-btn>
      <v-btn v-else class="mx-2" :disabled="!emailAddress || !isEmailAgreed" color="primary" @click="complete()">
        Finish
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    careerType: { type: String, default: 'Classic Builder' },
    interactionStyle: { type: String, default: 'Respond Before Engaging' },
    keyIndicators: {
      type: Array,
      default: () => ['Frustration', 'Satisfaction'],
    },
    decisionMakingStrategy: {
      type: String,
      default: 'Respond Then Follow Your Gut',
    },
    publicRole: { type: Array, default: () => ['Pioneer', 'Messenger'] },
    assimilation: { type: String, default: 'Independent' },
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
    value: { type: Object, default: null }
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
          results: [
            {
              check: (ans) => ans > 7,
              update: (ans) => -ans,
              msg: `${this.keyIndicators[0]} is your sign that you're doing things in contrast to 
              your design, and the fact that you feel that so often is a sign that
              something should change.`
            },
            {
              check: (ans) => ans < 3,
              update: (ans) => ans === 0 ? 6 : ans === 1 ? 4 : 2,
              msg: `${this.keyIndicators[0]} is your sign that you're doing things in contrast to
              your design, and the fact that you rarely feel that is a sign that you're
              doing things right.`
            }
          ]
        },
        {
          step: 'flowFrequency',
          isVisible: () => {
            return true
          },
          results: [
            {
              check: (ans) => ans > 7,
              update: (ans) => ans,
              msg: `${this.keyIndicators[1]} is your sign that you're doing things in alignment with
              your design, and the fact that you're feeling this quite often means something is going
              well with your job.`
            },
            {
              check: (ans) => ans < 3,
              update: (ans) => ans === 0 ? 6 : ans === 1 ? 4 : 2,
              msg: `${this.keyIndicators[1]} is your sign that you're doing things in alignment with
              your design, and the fact that this doesn't happen very often means some adjustments must
              be made either within your job or to get a new one.`
            }
          ]
        },
        {
          step: 'selfEmployed',
          isVisible: () => {
            return true
          },
          results: [
            {
              check: (ans) => ans === true && this.hatesBeingManaged,
              update: () => 5,
              msg: `There are a few people in the world who are designed to not have a boss,\
              and you are one of them. You hate being told what to do, and so having a boss\
              is the worst. You probably enjoy this freedom.`
            }
          ]
        },
        {
          step: 'workFromHome',
          isVisible: () => {
            return true
          },
          results: [
            {
              check: (ans) => ans === true && this.assimilation === 'Collaborative',
              update: () => -3,
              msg: `You are designed to work and collaborate with others, and so working
              separately from other people can make you feel uncomfortable or incomplete.
              It would be ideal if you worked in partnership with someone else, but if that's
              not possible, you should work in a place with other people around, such as
              a coffee shop or a co-working space.`
            },
            {
              check: (ans) => ans === true && this.assimilation === 'Assimilation',
              update: () => -5,
              msg: `You are designed to move around and work with a variety of people
              throughout the day, and so working from home by yourself can be a challenge for
              you. If you work in a large company, going into the office would be great for
              you.`
            }
          ]
        },
        {
          step: 'enterJobCorrectly',
          isVisible: () => {
            return this.answerFor('selfEmployed') === false
          },
          results: [
            {
              check: (ans) => ans > 7,
              update: (ans) => ans,
              msg: `${this.keyIndicators[1]} is your sign that you're doing things in alignment with
              your design, and the fact that you're feeling this quite often means something is going
              well with your job.`
            },
            {
              check: (ans) => ans === false,
              update: () => -2,
              msg: `It is always best to make decisions according to your Decision-Making Strategy,
              which for you is ${this.decisionMakingStrategy}. That you didn't do this doesn't mean
              you should leave your job right away, but if other things aren't going well, it provides
              support for making a job shift.`
            }
          ]
        },
        {
          step: 'smallGroup',
          isVisible: () => {
            return this.answerFor('selfEmployed') === false
          },
          results: [
            {
              check: (ans) => ans === true && this.hasPentaRoleStrengths,
              update: () => 5,
              msg: `You have genetic blueprints that work well in a small \
              group, as you are in. If you don't have a specific role yet, you \
              should work towards having one.`,
            },
            {
              check: (ans) => ans === true && this.hasPentaManagedStrengths && !this.hasPentaRoleStrengths,
              update: () => 1,
              msg: `You work in a small group and also have a genetic blueprints that work well in a small group,\
              and so you are an asset to the group. However being managed may\
              eventually be challenging for you.`
            },
            {
              check: (ans) => ans === true && !this.hasPentaManagedStrengths && !this.hasPentaRoleStrengths,
              update: () => -5,
              msg: `You work in a small group but well never feel comfortable in such a configuration.`
            },
            {
              check: (ans) => ans === true && this.assimilation === 'Collaborative',
              update: () => 5,
              msg: `You are designed to work and collaborate with others, so working with others in
              a group is a good thing. `,
            },
          ]
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
          isVisible: () => {
            return this.answerFor('selfEmployed') === false
          },
          results: [
            {
              check: (ans) => ans === true && this.hatesBeingManaged,
              update: () => -5,
              msg: `You have a boss, which for many people can be a nice sense of security.\
              Unfortunately, you have a genetic design which hates to be told what to do. You \
              would be best to look for work where you can be your own boss.`
            }
          ]
        },
        {
          step: 'newJob',
          isVisible: () => {
            return this.publicRole.includes('Influencer') === true
          },
          results: [
            {
              check: (ans) => ans === true && this.publicRole.includes('Influencer'),
              update: () => 20,
              msg: `Even if you despise your job, you should not leave a job until you have
              a new job lined up. Your huge network is an asset to finding that new job
              which fits you. Talk to all of these people and find a new opportunity which
              is correct for you ... and then come back and take the quiz again.`
            }
          ]
        },
        {
          step: 'emailAddress',
          isVisible: () => {
            return true
          },
          results: []
        },
      ],
      answers: {},
      emailAddress: undefined,
      isEmailAgreed: false,
      keyIndicatorFeelings: {
        Frustration: 'frustrated',
        Satisfaction: 'satisfied',
      },
      strategyTexts: {
        'Respond Then Follow Your Gut': 'follow your gut',
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
      return this.questions.reduce((a, v) => a + (v.isVisible() ? 1 : 0), 0)
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
    hatesBeingManaged() {
      return this.traitsWithoutQualities.includes("45") ||
        this.traitsWithoutQualities.includes("21")
    },
    conclusion: function () {
      return this.questions.reduce((acc, q) => {
        const answer = this.answers[q.step];
        q.results.forEach(e => {
          if (e.check(answer)) {
            acc.score += e.update(answer);
            acc.messages.push(e.msg);
          }
        })
        return acc;
      }, { score: 0, messages: [] })
    }

  },
  methods: {
    handleNext: function () { },
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
    hasTrait: function (n) {
      return this.traitsWithoutQualities.includes(n)
    },
    setEmailAgreed: function (v) {
      this.isEmailAgreed = v
    },
    complete: function () {
      this.$emit('complete', this.conclusion);
    }
  },
}
</script>
