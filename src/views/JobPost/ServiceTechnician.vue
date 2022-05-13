<template>
  <div class="service-technician primary">
    <v-container>
      <v-row class="braap-content">
        <v-col cols="12" class="text-center py-0">
          <div class="text-h5">BRAAP FULL TIME</div>
          <div class="jobpost-title font-weight-bold mt-2 white--text">Service Technician</div>
          <p class="ma-0">Remote Job</p>
          <div class="mt-7">
            <v-btn class="mr-2 rounded-10 body-0 px-8" x-large>
              <span>Refer a Friend</span>
            </v-btn>
            <v-btn class="ml-2 rounded-10 body-0 px-8" x-large color="braap_orange" dark @click="onInterestedClicked">
              <span>I'm Interested</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'ServiceTechnician',
    methods: {
      onInterestedClicked() {
        window.location.href = 'https://d40okpmrbb5wv.cloudfront.net/braapcrm/job-applications/jobs-page.html'
      }
    }
  }
</script>

<style lang="scss">
  .service-technician {
    padding: 100px 0;
    .jobpost-title {
      font-size: 50px;
    }
  }
</style>