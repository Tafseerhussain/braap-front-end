<template>
  <div class="pricing-footer pt-5">
    <v-container class="py-0">
      <div class="footer-header text-center font-weight-medium text-h5 primary--text">
        Flexible working models can help Braap customers achieve ROI and transform operations more quickly.
      </div>
      <div class="mt-8 mx-n2 d-flex " width="100%">
        <div class="footer-card mx-2 rounded-10">
          <div class="d-flex justify-center">
            <img src="/img/pricing/software.svg" class="fade-left-delay" />
          </div>
          <div class="my-5 font-weight-medium primary--text text-center text-h5">Software + Back-office</div>
          <v-spacer></v-spacer>
          <p class="text-subtitle-1 mt-3">
            When you work with Braap our back office comes with our software. Our team ensures every aspect of the
            service workflow is flawless, and nothing falls between the cracks at no additional cost.
          </p>
          <v-spacer></v-spacer>
        </div>
        <div class="footer-card mx-2 rounded-10">
          <div class="d-flex justify-center">
            <img src="/img/pricing/asset.svg" class="fade-left-delay"/>
          </div>
          <div class="my-5 font-weight-medium primary--text text-center text-h5">Asset and Machine Conversion</div>
          <v-spacer></v-spacer>
          <p class="text-subtitle-1 mt-3">
            If your business has a lot of assets and machines that need tagged, our team can do the work quickly saving
            time and money. <router-link to="/contact">Contact Us</router-link> for more information.
          </p>
          <v-spacer></v-spacer>
        </div>
        <div class="footer-card mx-2 rounded-10">
          <div class="d-flex justify-center">
            <img src="/img/pricing/scale.svg" class="fade-left-delay"/>
          </div>
          <div class="my-5 font-weight-medium primary--text text-center text-h5">Software + Back-office</div>
          <v-spacer></v-spacer>
          <p class="text-subtitle-1 mt-3">
            Scale your business, whether you utilize our global technician network, pick up and delivery service,
            supplier parts, or return processing Braap is here to help you scale your business.
          </p>
          <v-spacer></v-spacer>
        </div>
      </div>
      <div class="setup mt-8 text-h6">
        Setup these services in <router-link to="/my-shop">My Shop Customer Page</router-link> and select the options
        that are right for your business. Braap offers these services at market rate so you can charge according to your
        contractual relationships.
      </div>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'PricingFooter'
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .pricing-footer {
    padding-bottom: 100px;
    a {
      color: $braap_orange;
    }
    .footer-card {
      border: 2px solid transparent;
      box-shadow: var(--theme-shadow);
      padding: 30px;
      flex-basis: 33.3%;
      transition: 0.3s;
      &:hover {
        border-color: $braap_orange;
      }
    }
  }
</style>