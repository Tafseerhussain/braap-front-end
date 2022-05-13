<template>
  <v-card flat class="machine-jobs" color="transparent">
    <v-card-text>
      <template v-if="!loading">
        <template v-if="jobs.length > 0"> </template>
        <template v-else>
          <div class="empty-results d-flex flex-column align-center braap-content flex-grow-1 px-2 mt-4">
            <img src="/img/empty.png" alt="empty" height="300" class="mb-5" />
            <p class="mb-0">No jobs {{ filter === 'INPROGRESS' ? 'in progress' : 'in history' }}.</p>
          </div>
        </template>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'MachineJobs',
    components: {},
    props: {
      filter: {
        type: String
      }
    },
    data: function() {
      return {
        jobs: [],
        loading: false
      }
    },
    computed: {},
    created() {},
    watch: {},
    methods: {}
  }
</script>

<style lang="scss">
  .machine-jobs {
  }
</style>
