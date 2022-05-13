<template>
  <BraapBg2 class="braap-technician white">
    <v-container class="technician-container relative">
      <v-row>
        <v-col cols="12" md="6" class="py-0">
          <div class="pr-12 braap-content">
            <div class="page-title primary--text font-weight-bold">
              <span class="braap_orange--text">Braap</span>
              Technician
            </div>
            <p class="my-10">
              Control your work schedule, decision making, and earnings. Braap works with independent technicians to
              service a wide range of customers and industries.
            </p>
            <p class="my-10">
              Technicians work with Braap because our easy-to-use technology, company culture, and white-glove
              treatment.
            </p>
            <p class="my-10">
              • Earn above industry standard. <br />
              • Finish the work and get paid electronically. <br />
              • Get training points and tool packages, over time. <br />
              • Manage your own time and schedule. <br />
              • Focus on the work not the process and reporting.
            </p>
            <p class="my-10">
              To get started you must have a minimum of 3 years of technician experience in your industry, have your own
              workshop, and tools.
            </p>
            <v-btn color="sign-btn braap_orange rounded-10 px-8 body-0" x-large dark @click="onSignUpClicked">
              <span>Sign Up Now</span>
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="img-col py-5 py-md-0">
          <div class="img-container text-center">
            <img src="/img/technician/technician.jpg" alt="technician" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </BraapBg2>
</template>

<script>
  import BraapBg2 from '../../components/layouts/BraapBg_2.vue'
  export default {
    components: {
      BraapBg2
    },
    methods: {
      onSignUpClicked() {
        this.$router.push('job-post')
      }
    }
  }
</script>

<style lang="scss">
  .braap-technician {
    padding: 100px 0;
    .technician-container {
      .sign-btn {
        box-shadow: 0 3px 6px rgb(0 0 0 / 15%);
      }
    }
    .img-container {
      width: 100%;
    }
  }
</style>