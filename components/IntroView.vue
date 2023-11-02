<template>
  <v-container>
    <v-row class="d-flex flex-column flex-sm-row" justify="center"></v-row>
    <div class="text-h3 text-md-h1 mt-6 mt-md-16 my-4">So it's come to this.</div>
    <v-row class="d-flex flex-column flex-sm-row" justify="center">
      <v-col cols="12" sm="8">
          <div class="pt-md-4 pl-8 pl-md-16">
          <div class="font-italic">You're frustrated, disappointed, angry, or bitter.</div>
          <div class="font-italic">You want more peace, satisfaction, success, or surprise.</div>
        </div>
          <div class="text-h5 my-6">I've been there.<br/>You deserve a job you love.</div>
          <div class="my-4">
            <p>
            This free 2 minute quiz uses <span class="font-weight-bold">Human Design for
            Business</span> to compare your genetic strengths with your current job
            and reveals if it aligns with:
            </p>
            <p>
              <ul>
                <li>your specific KPIs (key performance indicators) for life</li>
                <li>your ideal work environment</li>
                <li>your ideal job style</li>
              </ul>
            </p>
            <p>This may be <span class="font-weight-bold">the most personal answer</span> you've ever received.</p>
          </div>
          <v-btn 
            color="primary"
            block
            class="d-sm-none mt-6"
            @click="$emit('click', $event)"
          >
            See if you're in the right job
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
    See if you're in the right job
    </v-btn>
  </v-container>
</template>
