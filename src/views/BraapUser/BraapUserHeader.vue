<template>
  <BraapBg2 class="braap-user-header white">
    <v-container relative>
      <v-row>
        <v-col cols="12 " class="text-center braap-content py-0">
          <div class="page-title primary--text font-weight-bold">
            <span class="braap_orange--text">Braap</span>
            User
          </div>
          <p class="mt-10 mb-7">
            An easy-to-user Intelligence Service Platform with a Growing Network of Global Technicians Behine it.
          </p>
          <div class="user-subhead font-weight-medium">
						Reasons customers like Braap
					</div>
        </v-col>
      </v-row>
      <CustomerReason class="customer-reason"></CustomerReason>
    </v-container>
  </BraapBg2>
</template>

<script>
  import BraapBg2 from '../../components/layouts/BraapBg_2.vue'
  import CustomerReason from '../Home/CustomerReason.vue'
  export default {
    name: 'BraapUserHeader',
    components: {
      BraapBg2,
      CustomerReason
    }
  }
</script>

<style lang="scss">
  .braap-user-header {
    padding: 50px 0 100px;

    .section-left {
      top: 20% !important;
    }

    .section-waves {
      top: 4%;
      right: 6%;
    }

    .section-dots {
      display: none;
    }

    .customer-reason {
      margin-top: 54px !important;
      padding: 0 !important;
    }

    .title-bar-left:after {
      top: 85%;
    }

    .user-subhead{
      font-size: 32px;
    }
  }
</style>