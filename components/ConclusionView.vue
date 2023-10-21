<template>
    <div class="ma-2">
        <div class="text-h4 text-md-h2 my-6">So, should you leave your job?</div>
        <div class="text-body-1">
            A quiz can never replace your own inner wisdom!
            So most importantly, follow your decision making strategy. Which is:
            <div class="my-6 text-center font-weight-bold">
                {{ decisionMakingStrategy }}
            </div>
        </div>
        <div class="text-body-1">
            <p>No matter what this quiz suggests, always
                make decisions according to your personal decision making strategy. If you need
                help understanding how to do that, you're in luck! By sharing your email, you'll
                be receiving content specifically for you and what makes you unique. If you need
                more support than this, I'm happy to help. Simply book a call with me. </p>
            <p>That being said, here's a guide that can support you on your decision.</p>
        </div>
        <div v-if="score < 3">
            <div v-if="findJobThroughNetwork">
                <div v-if="hasJobLinedUp">
                    <div class="text-h3">It's time to go.</div>
                    <div class="text-body1 my-6">You're feeling lots of resistence in your
                        current job and you've got another job lined up. So what are you
                        waiting for?
                    </div>
                </div>
                <div v-else>
                    <div class="text-h4 text-md-h3">Put your job search into overdrive.</div>
                    <div class="text-body-1 my-6">You're feeling lots of resistence with your new
                        job, but it's important not to leave until you have a new one lined
                        up. Your huge network is an asset to finding that new job
                        which fits you. Talk to all of these people and find a new opportunity which
                        is correct for you ... and then pull the trigger.
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="text-h4 text-md-h3">It's time to go.</div>
                <div class="text-body-1 my-6">You're feeling lots of resistence in your
                    current job. So what's holding you back?
                </div>
            </div>
        </div>
        <div v-else-if="score > 8">
            <div class="text-h4 text-md-h3">Actually things are pretty good.</div>
            <div class="text-body-1 my-6">It seems like you've got pretty good alignment with your
                current job. But since you're taking this test, it seems likely that you think
                there's something that could be better.
            </div>
        </div>
        <div v-else>
            <div class="text-h4 text-md-h3">See if you can make it better.</div>
            <div class="text-body-1 my-6">
                <p>You have a lot of positives for the current job. So my
                    question to you is: what's going wrong? And what changes can you make to feel
                    more in the flow? Perhaps a talk with your boss if you have one can align
                    you more with what you desire. Or if you're self-employed, maybe working with
                    others can be of help.</p>
                <p>More details are out of the scope of this quiz, but you can book an
                    appointment with me and I can support you in making your job better. This
                    quiz is only a start, and not the end!
                </p>
            </div>
        </div>

        <div class="text-h5">Here's how we came up with your answer:</div>
        <template v-for="(msg, index) in messages">
            <div :key="`msg-${index}`" class="pa-4">
                <div class="text-body-2">({{ deltaStr(index) }})</div>
                <div class="text-body-1">{{ msg }}</div>
            </div>
        </template>

        <!-- <div class="text-body-2 pa-4">
            Your score is {{ score }} out of 20.
        </div> -->
    </div>
</template>
  
<script>
export default {
    props: {
        score: { type: Number, required: true },
        hasJobLinedUp: { type: Boolean, default: false },
        findJobThroughNetwork: { type: Boolean, default: false },
        decisionMakingStrategy: { type: String, required: true },
        deltas: { type: Array, default: () => [] },
        messages: { type: Array, default: () => [] }
    },
    methods: {
        deltaStr: function (index) {
            return this.deltas[index] > 0 ? '+' + this.deltas[index] : this.deltas[index]
        }
    }
}
</script>
  