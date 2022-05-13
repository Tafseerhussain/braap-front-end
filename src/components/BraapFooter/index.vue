<template>
  <div class="braap-footer pt-15 overflow-hidden relative">
    <v-container class="pt-0">
      <v-row>
        <v-col cols="12" md="3" class="px-8 mb-5 mb-md-0">
          <a href="javascript:;">
            <v-icon dark class="braap-logo">$svg-braap-logo</v-icon>
          </a>
          <p class="footer-p body-0 my-13">
            A comprehensive, simple-to-use turnkey platform for service and repair businesses that offers unique
            features that enhance customer and technician collaboration.
          </p>
          <div class="footer-icon-links">
            <a href="https://www.youtube.com/channel/UCHej18vyOvtamw1zdhflvsw">
              <v-icon class="mr-4">$svg-youtube</v-icon>
              <!-- <v-icon dark class="mr-4">mdi-youtube</v-icon> -->
            </a>
            <a href="https://www.instagram.com/braap.io/">
              <v-icon class="mr-4">$svg-instagram</v-icon>
              <!-- <v-icon dark class="mr-4">mdi-instagram </v-icon> -->
            </a>
            <a href="https://www.facebook.com/braaptech/">
              <v-icon class="mr-4">$svg-facebook</v-icon>
            </a>
            <a href="https://www.linkedin.com/company/braaptech/">
              <v-icon class="mr-4">$svg-linkedin</v-icon>
            </a>
          </div>
        </v-col>
        <v-col cols="12" md="7" class="px-8 mb-5 mb-md-0">
          <div class="footer-header relative font-weight-bold text-h5">Services</div>
          <v-row class="mt-12">
            <v-col cols="12" md="6" class="pb-0 pb-md-3">
              <div class="footer-links">
                <router-link class="body-0 mb-5" to="/features/automated-job-quoting-and-estimating"
                  >Automated job quoting and estimating</router-link
                >
                <router-link class="body-0 mb-5" to="/features/consolidated-direct-parts-sourcing"
                  >Consolidated direct parts sourcing</router-link
                >
                <router-link class="body-0 mb-5" to="/features/curated-machine-learning-search-engine"
                  >Curated machine learning search engine</router-link
                >
                <router-link class="body-0 mb-5" to="/features/custom-part-kits">Custom part kits</router-link>
                <router-link class="body-0 mb-5" to="/features/end-to-end-full-service-workflow"
                  >End-to-end full-service workflow</router-link
                >
                <router-link class="body-0 mb-5" to="/features/fleet-management-shop"
                  >Fleet management shop</router-link
                >
                <router-link class="body-0 mb-5" to="/features/global-technician-workforce"
                  >Global technician workforce</router-link
                >
              </div>
            </v-col>
            <v-col cols="12" md="6" class="pt-0 pt-md-3">
              <div class="footer-links text-subtitle1">
                <router-link class="body-0 mb-5" to="/features/intelligence-auto-pilot-workflow-engine"
                  >Intelligence auto pilot workflow engine</router-link
                >
                <router-link class="body-0 mb-5" to="/features/interactive-visual-workspace"
                  >Interactive visual workspace</router-link
                >
                <router-link class="body-0 mb-5" to="/features/point-to-point-pickup-and-delivery"
                  >Point-to-point pickup and delivery</router-link
                >
                <router-link class="body-0 mb-5" to="/features/predictive-maintenance"
                  >Predictive maintenance</router-link
                >
                <router-link class="body-0 mb-5" to="/features/price-comparison-engine"
                  >Price comparison engine</router-link
                >
                <router-link class="body-0 mb-5" to="/features/sound-diagnostics">Sound diagnostics</router-link>
                <router-link class="body-0 mb-5" to="/features/visual-search">Visual search</router-link>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="2" class="px-8 mb-5 mb-md-0">
          <div class="footer-header relative font-weight-bold text-h5">Braap</div>
          <div class="footer-links mt-12">
            <router-link class="body-0 mb-5" to="/about">About</router-link>
            <router-link class="body-0 mb-5" to="/contact">Contact</router-link>
            <a class="body-0 mb-5" href="https://jobs.braap.io/jobs/Careers" target="_blank">Careers</a>
            <router-link class="body-0 mb-5" to="/supplier">Supplier partners</router-link>
            <a
              class="body-0 mb-5"
              href="https://app.termly.io/document/terms-of-use-for-ecommerce/4b48bc34-6569-47b4-9df0-4be1757265a5"
              >Terms and Conditions</a
            >
            <a
              class="body-0 mb-5"
              href="https://app.termly.io/document/privacy-policy/3922dc1c-21bc-4223-a254-67961fdc7767"
              >Privacy Policy</a
            >
            <a
              class="body-0 mb-5"
              href="https://app.termly.io/document/return-policy/045139e6-f094-4907-be2c-9aefaabd11b6"
              >Return Policy</a
            >
            <a class="body-0 mb-5" href="https://app.termly.io/document/disclaimer/7fd67cee-6664-4973-b8cf-d4c47e1a7efa"
              >Disclaimer</a
            >
          </div>
        </v-col>
      </v-row>
      <div class="text-center py-5">Copyright © All Rights Reserved by Braap - Trademark Pending 97313870</div>
    </v-container>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="scss">
  .braap-footer {
    letter-spacing: 0.5px;
    background: #000;
    color: #696969 !important;
    .braap-logo {
      svg {
        height: 50px;
        width: 34.5px;
      }
    }

    .footer-p {
      line-height: 36px !important;
    }

    .footer-icon-links {
      svg {
        width: 50px;
        height: 50px;
      }
    }

    .footer-links {
      a {
        color: #696969 !important;
        text-decoration: none;
        display: block;
        &:hover {
          color: #fff !important;
        }
        svg {
          width: 50px;
          height: 50px;
        }
      }
    }

    .footer-header {
      color: #fff;
      &:after {
        content: '';
        width: 50px;
        height: 3px;
        background: #e58a00;
        left: 0;
        bottom: -10px;
        position: absolute;
      }
    }
  }
</style>
