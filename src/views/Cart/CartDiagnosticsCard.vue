<template>
  <div>
    <div class="service-card pa-5 rounded-10 mb-5" v-if="!hasWorks">
      <div class="d-flex mx-n3">
        <div class="img-container mx-3">
          <div class="rounded-10 pa-4 works-img">
            <img src="/img/search/parts-icon.png" />
          </div>
        </div>

        <div class="right-container mx-3">
          <div class="header-container d-flex mx-n3">
            <div class="info-header mx-3">
              <div class="primary--text body-0 font-weight-bold">
                {{ diagnosticsObj.workName }}
              </div>
            </div>
            <div class="count-header mx-3">
              <div class="text-center body-0"><span v-if="tab !== 0">Quantity</span> {{ diagnosticsObj.workQty }}</div>
            </div>
            <div class="action-header mx-3">
              <div class="d-flex justify-end" v-if="tab === 0">
                <!-- <v-icon color="#ff0000" class="btn-icon">mdi-heart </v-icon> -->
                <v-tooltip top color="primary" content-class="top">
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      v-bind="attrs"
                      v-on="on"
                      class="pb-2 body-1 primary--text"
                      @click="onSavedBtnClicked('INSAVED')"
                    >
                      <v-icon color="#c4c4c4" class="btn-icon">mdi-heart </v-icon>
                    </div>
                  </template>
                  <div class="text-center">Saved for Later</div>
                </v-tooltip>
                <!-- <v-icon color="#c4c4c4" class="ml-5 btn-icon">mdi-trash-can </v-icon> -->
                <div class="ml-5">
                  <v-tooltip top color="primary" content-class="top">
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on" class="pb-2 body-1 primary--text" @click="onDeleteDiagnostics">
                        <v-icon color="#c4c4c4" class="btn-icon">mdi-trash-can </v-icon>
                      </div>
                    </template>
                    <div class="text-center">Remove</div>
                  </v-tooltip>
                </div>
              </div>

              <div class="d-flex justify-end" v-else-if="tab === 1">
                <div>
                  <v-tooltip top color="primary" content-class="top">
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        v-bind="attrs"
                        v-on="on"
                        class="pb-2 body-1 primary--text"
                        @click="onDiagnosticsBackCart('INCART')"
                      >
                        <v-icon color="#c4c4c4" class="btn-icon">mdi-cart </v-icon>
                      </div>
                    </template>
                    <div class="text-center">Back to Cart</div>
                  </v-tooltip>
                </div>

                <div class="ml-5">
                  <v-tooltip top color="primary" content-class="top">
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on" class="pb-2 body-1 primary--text" @click="onDeleteDiagnostics">
                        <v-icon color="#c4c4c4" class="btn-icon">mdi-trash-can </v-icon>
                      </div>
                    </template>
                    <div class="text-center">Remove</div>
                  </v-tooltip>
                </div>
              </div>

              <div class="d-flex justify-end" v-else-if="tab === 2">
                <div>
                  <v-tooltip top color="primary" content-class="top">
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on" class="pb-2 body-1 primary--text">
                        <img src="/icons/eye-gray.svg" />
                      </div>
                    </template>
                    <div class="text-center">Check Status</div>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-container d-flex mx-n3">
            <div class="left-detail mx-3">
              <div class="my-1 text-subtitle-2">ESTIMATING PRICE</div>
              <div class="text-caption">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eu dolor faucibus, laoreet magna sed,
                porttitor nulla...
              </div>
            </div>
            <div class="right-detail mx-3">
              <div class="mt-10 primary--text" v-if="tab !== 2">
                <div class="text-end mb-3">{{ diagnosticsObj.workPrice | currency }}</div>
                <div class="text-end">Subtotal > {{ subTotal | currency }}</div>
              </div>
            </div>
          </div>

          <div class="d-flex mx-n3 justify-space-between mt-3 primary--text" v-if="tab === 2">
            <div class="mx-3">{{ diagnosticsObj.workPrice | currency }}</div>
            <div class="mx-3">Subtotal > {{ (diagnosticsObj.workPrice * diagnosticsObj.workQty) | currency }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-n5 pt-5 overflow-hidden" :class="{ 'cart-part-container': hasWorks }">
      <div v-if="hasWorks && !isService" class="primary--text body-0 font-weight-bold mb-4">
        Parts, no related diagnostic
      </div>
      <div :class="{ 'cart-part-container': !hasWorks }">
        <cart-part-card
          @open-detail="openProduct"
          v-for="parts in diagnosticsObj.parts"
          :key="parts.cartItemId"
          :partObj="parts"
        ></cart-part-card>
      </div>
    </div>

    <ProductDialog ref="productDialog"></ProductDialog>
  </div>
</template>

<script>
  import CartPartCard from './CartPartCard.vue'
  import { mapState } from 'vuex'
  import ProductDialog from '@/components/Search/ProductDialog'
  export default {
    name: 'ServiceCard',
    props: ['diagnosticsObj', 'machineObj'],
    components: {
      CartPartCard,
      ProductDialog
    },
    computed: {
      ...mapState({
        tab: state => state.cart.tab,
        selectedType: state => state.cart.selectedType
      }),
      subTotal() {
        const sum = this.diagnosticsObj.workPrice * this.diagnosticsObj.workQty
        return sum
      },
      hasWorks() {
        return this.diagnosticsObj.vehicleWorkId === 'STANDALONE PART'
      },
      isService() {
        return !!this.selectedType.find(item => item === 'service')
      }
    },
    methods: {
      onSavedBtnClicked(status) {
        this.$axios.post(`/api/cart/items/${this.diagnosticsObj.cartItemId}/Status/${status}`).then(result => {
          if (result.success && result.data) {
            this.getCartData()
          }
        })
      },
      onDeleteDiagnostics() {
        this.$axios.post(`/api/cart/items/delete/${this.diagnosticsObj.cartItemId}`).then(result => {
          if (result.success && result.data) {
            this.getCartData()
          }
        })
      },
      onDiagnosticsBackCart(status) {
        this.$axios.post(`/api/cart/items/${this.diagnosticsObj.cartItemId}/Status/${status}`).then(result => {
          if (result.success && result.data) {
            this.getCartData()
          }
        })
      },
      getCartData() {
        this.$store.dispatch('cart/getCartListItems')
        this.$store.dispatch('cart/getHistoryListItems')
        this.$store.dispatch('cart/getSavedListItems')
      },
      openProduct(part) {
        this.$refs.productDialog.openProduct({ braap_part_number: part.cartItemId, price: part.partPrice })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .service-card {
    width: 100%;
    border: 1px solid $braap_light_grey;
    background: #fbfbfb;
    transition: 0.3s;
    &:hover {
      box-shadow: var(--theme-shadow);
      .works-img {
        img {
          transform: rotate(360deg);
        }
      }
    }
    .img-container {
      flex-basis: 16.6%;
      .works-img {
        border: 1px solid $braap_light_grey;
        overflow: hidden;

        img {
          transition: 0.5s;
          width: 100%;
          display: block;
        }
      }
    }

    .right-container {
      flex-basis: 83.4%;
      .header-container {
        .info-header {
          flex-basis: 60%;
        }
        .count-header {
          flex-basis: 20%;
        }
        .action-header {
          flex-basis: 20%;
          img {
            width: 24px;
            cursor: pointer;
          }
          .btn-icon {
            cursor: pointer;
          }
        }
      }
      .detail-container {
        .left-detail {
          flex-basis: 60%;
        }
        .right-detail {
          flex-basis: 40%;
        }
      }
    }
  }

  .overflow-hidden {
    overflow: hidden;
  }

  .cart-part-container {
    // overflow: hidden;
    width: 95%;
    margin-left: 5%;
  }
</style>