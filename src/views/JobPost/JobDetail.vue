<template>
  <div class="job-detail white">
    <v-container>
      <v-row>
        <v-col cols="12" md="8" class="py-0 braap-content">
          <div class="font-weight-bold text-h5 primary--text mb-7">Job Description</div>
          <p class="my-5">This is a remote position.</p>
          <p class="my-5">
            Braap is looking for highly motivated individuals do projects, maintenance, and repair on a variety of
            machines and assets. We are a global team of mechanics and technicians that love what we do and are
            passionate about fixing things to the highest standard.
          </p>
          <p class="my-5">
            We are currently seeking Service Technicians to join our seasoned staff. Our service technicians:
          </p>
          <p class="my-5">
            • Set their own schedules. <br />
            • Work from home. <br />
            • Enjoy excellent pay. <br />
            • Qualified candidates will be energetic and self-motivated.
          </p>
          <div class="reiquire-title font-weight-bold text-h5 primary--text mb-7">Requirements</div>
          <p class="my-5">
            • Expert in your industry with project, repair, and maintenance work.<br />
            • Familiar with product lines including OEM, Aftermarket, and Used.<br />
            • Proven track record of fixing, and testing repairs.<br />
            • Ownership of tools and workspace.
          </p>
          <div class="reiquire-title font-weight-bold text-h5 primary--text mb-7">Benefits</div>
          <p class="my-5">
            • Focus on the work you like to do.<br />
            • Get recognized for your abilities.<br />
            • Control your own schedule.<br />
            • Overtime, get advanced tools and expert training.<br />
            • Earn up to $50 an hour.
          </p>
          <v-btn
            class="intersted-btn rounded-10 body-0 px-8 mt-10"
            x-large
            color="braap_orange"
            dark
            @click="onInterestedClicked"
          >
            <span>I'm Interested</span>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4" class="py-5 py-md-0">
          <div class="job-card py-10">
            <div class="text-h5 font-weight-bold mb-7 text-center primary--text">Job Information</div>
            <v-row class="mb-4">
              <v-col cols="1" class="py-0"><img src="/icons/chevron-right.svg" /></v-col>
              <v-col cols="11" class="pl-0 py-0 fade-left">
                <div class="primary--text font-weight-medium">Industry</div>
                <div class="card-content">Repair / Maintenance</div>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="my-4">
              <v-col cols="1" class="py-0"><img src="/icons/chevron-right.svg" /></v-col>
              <v-col cols="11" class="pl-0 py-0 fade-left">
                <div class="primary--text font-weight-medium">Work Experience</div>
                <div class="card-content">1 - 3 years</div>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="mt-4">
              <v-col cols="1" class="py-0"><img src="/icons/chevron-right.svg" /></v-col>
              <v-col cols="11" class="pl-0 py-0 fade-left">
                <div class="primary--text font-weight-medium">Salary</div>
                <div class="card-content">Upto $50 an hour</div>
              </v-col>
            </v-row>
            <v-btn class="remote-btn mt-8 rounded-10" x-large color="#e6e6e6"
              ><img src="/icons/globe.svg" alt="globe" class="mr-1" /> Remote Job</v-btn
            >
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'JobDetail',
    methods: {
      onInterestedClicked() {
        window.location.href = 'https://d40okpmrbb5wv.cloudfront.net/braapcrm/job-applications/jobs-page.html'
      }
    }
  }
</script>

<style lang="scss">
  .job-detail {
    padding: 80px 0;
    .reiquire-title {
      margin-top: 60px;
    }
    .interested-btn {
      box-shadow: 0 3px 6px rgb(0 0 0 / 15%);
    }
    .job-card {
      padding-left: 30px;
      padding-right: 30px;
      box-shadow: 0 3px 6px rgb(0 0 0 / 15%);
      .card-content {
        margin-top: 10px;
      }
      .remote-btn {
        width: 100%;
        box-shadow: none;
      }
    }
  }
</style>