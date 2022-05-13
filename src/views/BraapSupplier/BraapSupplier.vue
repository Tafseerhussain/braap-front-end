<template>
  <div>
    <BraapBg2 class="braap-supplier white">
      <v-container class="supplier-container relative">
        <v-row>
          <v-col cols="12" md="6" class="py-0">
            <div class="pr-12 braap-content">
              <div class="primary--text font-weight-bold page-title">
                <span class="braap_orange--text">Braap</span>
                Supplier
              </div>
              <p class="my-10">
                Engage with a community of service companies and technicians that use the advanced technology to do
                their job. Coonect with customers that want the best part and products for their maintenance and
                repairs.
              </p>
              <v-btn x-large color="braap_orange" dark class="rounded-10 px-8 body-0"> Read More </v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="py-5 py-md-0">
            <div class="img-container my-0 mx-auto">
              <img src="/img/supplier/supplier.jpg" alt="supplier" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </BraapBg2>
  </div>
</template>

<script>
  import BraapBg2 from '../../components/layouts/BraapBg_2.vue'
  export default {
    name: 'BraapSupplier',
    components: {
      BraapBg2
    }
  }
</script>

<style lang="scss">
  .braap-supplier {
    padding: 100px 0;
    .supplier-container {
      .img-container {
        width: 70%;
        img {
          width: 100%;
        }
      }
    }
  }
</style>