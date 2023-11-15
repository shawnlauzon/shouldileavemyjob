<template>
  <v-container class="ma-2">
    <div class="text-h2 text-md-h1">Drumroll please ...</div>
    <div v-if="chart">
      <div v-if="user" class="text-h4 text-md-h2 my-6">
        So {{ user.firstName }}, should you leave your job?
      </div>
      <div class="text-body-1">
        A quiz can never replace your own inner wisdom! So most importantly,
        follow your decision making strategy. Which is:
        <div class="my-4 text-h4 text-center">
          {{ chart.decisionMakingStrategy }}
        </div>
      </div>
      <div class="text-body-1">
        <p>
          No matter what this quiz suggests, always make decisions according to
          your personal decision making strategy. If you need help understanding
          how to do that, you're in luck! By sharing your email, you'll be
          receiving content specifically for you and what makes you unique. If
          you need more support than this, I'm happy to help. Simply book a call
          with me.
        </p>
        <p>
          That being said, here's a guide that can support you on your decision.
        </p>
      </div>
      <div v-if="score < 3">
        <div v-if="findJobThroughNetwork">
          <div v-if="answers.newJob">
            <div class="text-h3">It's time to go.</div>
            <div class="text-body1 my-6">
              You're feeling lots of resistence in your current job and you've
              got another job lined up. So what are you waiting for?
            </div>
          </div>
          <div v-else>
            <div class="text-h3 text-md-h3">
              Put your job search into overdrive.
            </div>
            <div class="text-body-1 my-6">
              You're feeling lots of resistence with your new job, but it's
              important not to leave until you have a new one lined up. Your
              huge network is an asset to finding that new job which fits you.
              Talk to all of these people and find a new opportunity which is
              correct for you ... and then pull the trigger.
            </div>
          </div>
        </div>
        <div v-else>
          <div class="text-h3 text-md-h3">It's time to go.</div>
          <div class="text-body-1 my-6">
            You're feeling lots of resistence in your current job. So what's
            holding you back?
          </div>
        </div>
      </div>
      <div v-else-if="score > 8">
        <div class="text-h3 text-md-h3">Actually things are pretty good.</div>
        <div class="text-body-1 my-6">
          It seems like you've got pretty good alignment with your current job.
          But since you're taking this test, it seems likely that you think
          there's something that could be better.
        </div>
      </div>
      <div v-else>
        <div class="text-h3 text-md-h3">See if you can make it better.</div>
        <div class="text-body-1 my-6">
          <p>
            You have a lot of positives for the current job. So my question to
            you is: what's going wrong? And what changes can you make to feel
            more in the flow? Perhaps a talk with your boss if you have one can
            align you more with what you desire. Or if you're self-employed,
            maybe working with others can be of help.
          </p>
          <p>
            More details are out of the scope of this quiz, but you can book an
            appointment with me and I can support you in making your job better.
            This quiz is only a start, and not the end!
          </p>
        </div>
      </div>

      <div v-if="messages" class="text-h5">
        Here's how we came up with your answer:
        <template
          v-for="(e, idx) in Array.from(messages).sort(
            (a, b) => Math.abs(b.delta) - Math.abs(a.delta)
          )"
        >
          <div :key="`msg-${idx}`" class="pa-4">
            <div class="text-body-2">
              ({{ e.delta > 0 ? '+' + e.delta : e.delta }})
            </div>
            <div class="text-body-1">{{ e.message }}</div>
          </div>
        </template>
      </div>

      <!-- <div class="text-body-2 pa-4">
            Your score is {{ score }} out of 20.
        </div> -->
    </div>
  </v-container>
</template>

<script>
import evaluate from './evaluate'

export default {
  props: {
    interviewId: { type: Number, required: true },
  },
  data: () => {
    return {
      chart: null,
      user: null,
      score: undefined,
      answers: undefined,
      messages: [],
    }
  },
  // If I don't have this set, the full URL is required for some reason
  fetchOnServer: false,
  async fetch() {
    this.interview = await this.$http.$get(
      '/api/get-interview?id=' + this.interviewId
    )
    this.chart = this.interview.chart
    this.user = this.interview.user
    this.answers = this.interview.answers

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const obj = this

    const { score, messages } = evaluate(this.chart, this.answers, obj.$i18n)

    this.score = score
    this.messages = messages
  },
  computed: {
    findJobThroughNetwork: function () {
      return this.chart?.publicRole?.includes('Influencer')
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
largeGroup:
  You have genetic blueprints that work well in a large group, as you are in. In
  fact, you have one of the strengths which is ideal for being the Executive in a department
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
