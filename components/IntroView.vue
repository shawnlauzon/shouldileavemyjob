<template>
  <v-container>
    <v-row class="d-flex flex-column flex-sm-row" justify="center"></v-row>
    <div class="text-h3 text-md-h1 mt-16 my-4">So it's come to this.</div>
    <v-row class="d-flex flex-column flex-sm-row" justify="center">
      <v-col cols="12" sm="8">
          <div class="font-italic">Are you frustrated, disappointed, angry, or bitter?</div>
          <div class="font-italic">Do you want more peace, satisfaction, success, or surprise?</div>
          <div class="text-h5 my-6">You deserve a job you love.</div>
          <div class="my-4">
            <p>
            Answer a few questions to get some clarity in
            this decision. Our automated system uses BG5 (Human Design for
            Business) to compare your genetic strengths with your current job
            and tells you what we've found. You'll learn if your job matches:
            </p>
            <p>
              <ul>
                <li>your specific KPIs (key performance indicators) for life</li>
                <li>your ideal work environment</li>
                <li>your ideal job style</li>
              </ul>
            </p>
            <p>This may be the most personal guide you've ever received.</p>
          </div>
          <div class="my-2">
            <span class="font-weight-bold">You're welcome.</span>
          </div>
          <v-btn 
            color="primary"
            block
            class="d-sm-none mt-6"
            @click="$emit('click', $event)"
          >
            Get started
          </v-btn>

      </v-col>
      <v-col cols="12" sm="4">
        <v-img src="/woman-confused.jpg" />
      </v-col>
    </v-row>
    <v-btn
      color="primary"
      block
      class="d-none d-sm-flex mt-6 px-15"
      @click="$emit('click', $event)"
    >
      Get started
    </v-btn>
  </v-container>
</template>
