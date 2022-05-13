<template>
  <div data-braap>
    <v-app>
      <div class="timeline">
        <template v-if="!loading">
            <perfect-scrollbar class="event-container">
              <TechAcceptJobs></TechAcceptJobs>
              <!-- <TechReviewJobs></TechReviewJobs> -->
            </perfect-scrollbar>
        </template>
        <template v-else>
          <v-skeleton-loader ref="skeleton" type="article" class="mx-auto"></v-skeleton-loader>
          <v-skeleton-loader ref="skeleton" type="list-item-two-line" class="mx-auto"></v-skeleton-loader>
          <v-skeleton-loader ref="skeleton" type="list-item-three-line" class="mx-auto"></v-skeleton-loader>
          <v-skeleton-loader ref="skeleton" type="list-item-two-line" class="mx-auto"></v-skeleton-loader>
        </template>
      </div>
    </v-app>
  </div>
</template>

<script>
  import TechAcceptJobs from './AcceptJobs.vue'
  // import TechReviewJobs from './ReviewJobs'

  export default {
    name: 'TimelineTechUser',
    components: {
      TechAcceptJobs,
      // TechReviewJobs
    },
    data: function() {
      return {
        loading: false,
        machine: null,
        maintenance: null
      }
    },
    computed: {
    },
    created() {
    },
    methods: {
    }
  }
</script>

<style lang="scss">
  
</style>
