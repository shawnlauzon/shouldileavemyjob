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
              'Usually me with one other person.',
              'Usually me with a group of people.',
            ]"
          >
            And at any one time, how are you connecting?
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
const COLLABORATION_SOLO = 0
const COLLABORATION_PARTNER = 1
const COLLABORATION_SMALL_TEAM = 2
const COLLABORATION_LARGE_VARIETY = 3

const INTERACTION_SOLO = 0
const INTERACTION_ONE_ON_ONE = 1
const INTERACTION_ONE_ON_MANY = 2

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
          results: [
            {
              check: (ans) => ans > 7,
              update: (acc, ans) =>
                acc.update(-Math.round(ans ** 1.3) + 3, 'resistenceHigh', {
                  indicator: this.keyIndicators[0],
                }),
            },
            {
              check: (ans) => ans > 5 && ans <= 7,
              update: (acc, ans) =>
                acc.update(-ans, 'resistenceHigh', {
                  indicator: this.keyIndicators[0],
                }),
            },
            {
              check: (ans) => ans <= 5 && ans >= 4,
              update: (acc) =>
                acc.update(0, 'resistenceMed', {
                  indicator: this.keyIndicators[0],
                }),
            },
            {
              check: (ans) => ans < 4,
              update: (acc, ans) =>
                acc.update(10 - ans * 3, 'resistenceLow', {
                  indicator: this.keyIndicators[0],
                }),
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
                acc.update(Math.round(ans ** 1.3) - 5, 'flowHigh', {
                  indicator: this.keyIndicators[1],
                }),
            },
            {
              check: (ans) => ans <= 7 && ans >= 4,
              update: (acc, ans) =>
                acc.update(ans - 2, 'flowMed', {
                  indicator: this.keyIndicators[1],
                }),
            },
            {
              check: (ans) => ans < 4,
              update: (acc, ans) =>
                acc.update(-Math.round((10 - ans) ** 1.3) + 8, 'flowLow', {
                  indicator: this.keyIndicators[1],
                }),
            },
          ],
        },
        {
          step: 'collaboration',
          isVisible: () => true,
          results: [
            {
              check: (ans) => ans === COLLABORATION_SOLO,
              update: (acc) => {
                switch (this.assimilation) {
                  case 'Independent':
                    acc.update(10, 'independentSolo')
                    break
                  default:
                    acc.update(-10, 'notIndependentSolo')
                    break
                }
              },
            },
            {
              check: (ans) => ans === COLLABORATION_PARTNER,
              update: (acc) => {
                switch (this.assimilation) {
                  case 'Independent':
                    acc.update(-2, 'independentNotSolo')
                    break
                  case 'Collaborative':
                    acc.update(10, 'collaborativePartner')
                    break
                  case 'Synthesizing':
                    acc.update(-4, 'multipleSplitPartner')
                    break
                  default:
                    acc.update(-6, 'multipleSplitPartner')
                    break
                }
              },
            },
            {
              check: (ans) => ans === COLLABORATION_SMALL_TEAM,
              update: (acc) => {
                switch (this.assimilation) {
                  case 'Independent':
                    acc.update(-2, 'independentNotSolo')
                    break
                  case 'Collaborative':
                    acc.update(6, 'collaborativeSmallGroup')
                    break
                  case 'Synthesizing':
                    acc.update(-4, 'multipleSplitSmallGroup')
                    break
                  default:
                    acc.update(-6, 'multipleSplitSmallGroup')
                    break
                }

                if (this.hasPentaRoleStrengths) {
                  acc.update(10, 'smallGroupUpperPenta')
                } else if (this.hasPentaManagedStrengths) {
                  acc.update(5, 'smallGroupLowerPenta')
                } else {
                  acc.update(-7, 'smallGroupNotPenta')
                }
              },
            },
            {
              check: (ans) => ans === COLLABORATION_LARGE_VARIETY,
              update: (acc) => {
                switch (this.assimilation) {
                  case 'Independent':
                    acc.update(2, 'independentNotSolo')
                    break
                  case 'Collaborative':
                    acc.update(2, 'collaborativeVariety')
                    break
                  default:
                    acc.update(10, 'multipleSplitVariety')
                    break
                }
              },
            },
          ],
        },
        {
          step: 'interaction',
          isVisible: () => true,
          results: [
            {
              check: (ans) => ans === INTERACTION_SOLO,
              update: (acc) => {
                switch (this.careerType) {
                  case 'Advisor':
                    acc.update(-10, 'advisorSolo')
                    break
                  case 'Evaluator':
                    acc.update(-3, 'evaluatorSolo')
                    break
                  case 'Initiator':
                    acc.update(5, 'initiatorSolo')
                    break
                  default: // Builder
                    acc.update(-5, 'builderSolo')
                    break
                }
              },
            },
            {
              check: (ans) => ans === INTERACTION_ONE_ON_ONE,
              update: (acc) => {
                switch (this.careerType) {
                  case 'Advisor':
                    acc.update(10, 'advisorOneOnOne')
                    break
                  case 'Evaluator':
                    acc.update(-3, 'evaluatorOneOnOne')
                    break
                  case 'Initiator':
                    acc.update(-4, 'initiatorOneOnOne')
                    break
                  default: // Builder
                    acc.update(2, 'builderOneOnOne')
                    break
                }
              },
            },
            {
              check: (ans) => ans === INTERACTION_ONE_ON_MANY,
              update: (acc) => {
                switch (this.careerType) {
                  case 'Advisor':
                    acc.update(-10, 'advisorGroups')
                    break
                  case 'Evaluator':
                    acc.update(10, 'evaluatorGroups')
                    break
                  case 'Initator':
                    acc.update(5, 'initiatorGroups')
                    break
                  default: // Builder
                    acc.update(5, 'builderGroups')
                    break
                }
              },
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
          results: [
            {
              check: (ans) => ans === true && this.hatesBeingManaged,
              update: (acc) => acc.update(10, 'hatesManagedSelfEmployed'),
            },
          ],
        },
        {
          step: 'haveBoss',
          isVisible: () =>
            this.answerFor('selfEmployed') === false && this.hatesBeingManaged,
          results: [
            {
              check: (ans) => ans === true && this.hatesBeingManaged,
              update: (acc) => acc.update(-10, 'hatesManagedHasBoss'),
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
    conclusion() {
      const obj = this
      const acc = {
        score: 0,
        hasJobLinedUp: undefined,
        findJobThroughNetwork: this.publicRole.includes('Influencer'),
        messages: [],
        update: (delta, key, params) => {
          acc.score += delta
          acc.messages.push({ delta, message: obj.$i18n.t(key, params) })
          return acc
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
      // result.score = Math.max(0, acc.score)
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

<i18n lang="yaml" locale="en">
resistenceLow: "{indicator} is your sign that you're doing things in contrast to
  your design, and the fact that you feel it so rarely is a good sign."
resistenceMed: "{indicator} is your sign that you're doing things in contrast to
  your design, and even though it's not super frequent, it is a drain on your happiness."
resistenceHigh:
  "{indicator} is your sign that you're doing things in contrast to
  your design, and the fact that you feel that so often is a sign that
  something should change."
flowHigh: "{indicator} is your sign that you're doing things in alignment with
  your design, and the fact that you're feeling this quite often means something is going
  well with your job."
flowMed: "{indicator} is your sign that you're doing things in alignment with
  your design, and it's great that you feel it sometimes, but it would be nice to feel it
  more often."
flowLow: "{indicator} is your sign that you're doing things in alignment with
  your design, and the fact that this doesn't happen very often means some adjustments must
  be made either within your job or to get a new one."
independentSolo: You are designed to work alone, so working by yourself works great for you.
notIndependentSolo:
  You are designed to work with others, and so working by yourself can
  be a challenge. You might find that things just don't come together like they do when you
  are with others. Give yourself plenty of time to process information.
  It would be ideal if you worked in partnership with someone else, but if that's
  not possible, you should work in a place with other people around, such as
  a coffee shop or a co-working space.
independentNotSolo:
  You are designed to work alone, but you can work with others. The only
  downside is that you can't make decisions as fast as you might prefer.
collaborativePartner:
  You are designed to work with others, and working with a single person like you are
  current doing is ideal, assuming it's the right person. If you're flowing, then you're
  in the exact right place. If not, then no matter what this quiz says, you should really
  consider finding a new partner.
multipleSplitPartner:
  You are designed to move around and work with a variety of people
  throughout the day, and so working with one person all the time won't give you the
  variety you crave. Being able to work in a variety of environments would be great for you.
collaborativeSmallGroup:
  You are designed to work with others, but certain people will work better for you than
  others. In a small group, you may find that certain people you flow with and others it
  feels like there's a block.
multipleSplitSmallGroup:
  You are designed to move around and work with a variety of people
  throughout the day, and so working with the same people all the time won't give you the
  variety you crave. Being able to work in a variety of environments would be great for you.
collaborativeVariety:
  You are designed to work with others, but certain people will work better for you than
  others. When you are working with a variety of people, you may find that certain people you
  flow with and others it feels like there's a block.
multipleSplitVariety:
  You are designed to move around and work with a variety of people
  throughout the day, so your current work environment is ideal for you!
advisorGroups:
  As an Advisor, you are best working 1x1. So working frequently with groups of people can
  be draining. If you don't get enough rest you'll be quickly burnt out.
evaluatorGroups:
  As an Evaluator, working with groups of people is your ideal place to be.
  Better than anyone else, you can gauge the health of the group to know what needs to change.
initiatorGroups:
  As an Initator, your main talent is to get things started. But don't get dragged
  into the day-to-day operations of a business; it's not where you shine.
builderGroups: As a Builder, you work very well with groups of people.
advisorSolo:
  As an Advisor, you are best working 1x1, advising other people. Working by yourself can be
  fine to grow your skills, but you should spend most of your time with one other person.
evaluatorSolo:
  As an Evaluator, working with groups of people is your ideal place to be.
  So working by yourself can be relaxing, but not where you really shine.
initiatorSolo:
  As an Initator, your main talent is to get things started. So spending a lot of time by
  yourself is excellent to do the work to make your vision happen. And when it's time, don't
  delay in getting out there and making something happen.
builderSolo:
  As a Builder, you are meant to live in Response, and being by yourself for too long might
  not give you the opportunities you need. So make sure you get out and interact with the
  world, because that's the only way you can decide what is best for you.
advisorOneOnOne:
  As an Advisor, you are best working 1x1. So spend as much time as you can in these types of
  interactions where you can advise or coach others.
evaluatorOneOnOne:
  As an Evaluator, working with groups of people is your ideal place to be.
  So working with a single person can be relaxing, but not where you really shine.
initiatorOneOnOne:
  As an Initator, your main talent is to get things started. So you can work with a single
  person in this, but it's probably not where your talent lies.
builderOneOnOne:
  As a Builder, you can work with single people, but where you really shine is
  with groups of people.
smallGroupUpperPenta: You have genetic blueprints that work well in a small
  group, as you are in. If you don't have a specific role yet, you
  should work towards having one.
smallGroupLowerPenta:
  You work in a small group and also have a genetic blueprints that work well in a small group,
  and so you are an asset to the group. However being managed may
  eventually be challenging for you.
smallGroupNotPenta: You work in a small group but well never feel comfortable in such a configuration.
smallGroupCollaborative:
  You are designed to work and collaborate with others, so working with others in
  a group is a good thing.
partnerCollaborative:
  You are designed to work and collaborate with others, so working
  with someone else is fantastic for you.
partnerAssimilation:
  You are designed to work and collaborate with others, so working
  with someone else is fantastic for you. However you work best when you work with a variety of people,
  so make sure to allow that movement in your daily work.
hatesManagedSelfEmployed:
  'There are a few people in the world who are designed to not have a boss,
  and you are one of them. You hate being told what to do, and so having a boss
  is the worst. So, well done on working for yourself!'
hatesManagedHasBoss:
  You have a boss, which for many people can be a nice sense of security.
  Unfortunately, you have a genetic design which hates to be told what to do. You
  would be best to look for work where you can be your own boss.
</i18n>
