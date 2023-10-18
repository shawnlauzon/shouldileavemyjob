<template>
    <v-card height="6em" class="text-h2 pa-6 elevation-0 d-inline-flex flex-column">
        <div v-if="shouldLeaveJob" class="text-h2">You should leave your job.</div>
        <div v-else class="text-h2">You should stay at your job (for now).</div>

        <div class="text-body-2 pa-4">
            Your score is {{ value.score }} out of 20.
        </div>

        <template v-for="(msg, index) in value.messages">
            <div :key="`msg-${index}`" class="text-body-1 pa-4">{{ msg }}</div>
        </template>

    </v-card>
</template>
  
<script>
export default {
    props: { value: { type: Object, default: null } },
    computed: {
        shouldLeaveJob: function () {
            return this.value.score < 0
        }
    }
}
</script>
  