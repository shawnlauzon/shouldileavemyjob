<template>
  <v-app>
    <v-main>
      <v-container>
        <div v-if="!hasDesign" class="intro">
          <h1>Should I leave my job?</h1>
          <h2>
            So you've had it up to here with your job, but don't know what to do
            about it. I've totally been there.
          </h2>
          <p>
            There must be more to life. Going to work, coming home exhausted. A
            rat on a treadmill. Maybe it wasn't always this way. You might love
            the career but not the job. Or perhaps you want something completely
            different: a brand new path, or maybe start your own business.
          </p>
          <p>
            But how to get started, especially with all the pressure. Every.
            Single. Day.
          </p>
          <p>
            I get it. I've struggled with wondering “should I stay or should I
            go?” I've stayed at some jobs too long, and some not long enough. I've
            kept going back to a career that didn't fully satisfy me. I've dumped
            it all, destroyed my credit, and built it back again. It's painful.
          </p>
          <p>
            But it doesn't have to be that way. I put together these tips that I
            wish I had when I was going through this. And here's what's unique:
            they're made <b>specifically for you</b>. Rather than a
            one-size-fits-some approach that you can find all over the web, I
            guide you through questions which are designed
            <i>for your unique nature</i>. This may be the most personal guide
            you've ever received.
          </p>
          <p>You're welcome.</p>
          <!-- <BirthDataForm /> -->
        </div>

        <InterviewForm v-if="!isComplete" v-model="conclusion" @complete="handleComplete" />
        <ConclusionView v-else v-model="conclusion" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: function () {
    return {
      hasDesign: true,
      design: undefined,
      conclusion: undefined,
      isComplete: false
    }
  },
  computed: {},
  methods: {
    handleComplete: function () { this.isComplete = true; },

  },
}
</script>

