<template>
  <div class="cart-part-card pa-5 mb-5 rounded-10">
    <div class="d-flex mx-n3">
      <div class="img-container mx-3">
        <div class="add-border white rounded-10 pa-1">
          <v-img class="mb-2" width="150" aspect-ratio="1" :src="innerImg" @error="innerImg = '/img/no-image.svg'">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </div>
      </div>

      <div class="right-container mx-3">
        <div class="d-flex header-container mx-n3">
          <div class="info-header mx-3">
            <a @click="openDetail" class="primary--text body-0 font-weight-bold header-link">
              <div>
                {{ partObj.partName }}
              </div>
            </a>
          </div>
          <div class="count-header mx-3">
            <v-text-field
              @keypress.enter="onCountChanged"
              @blur="onCountChanged"
              outlined
              hide-details
              class="rounded-10 search-ipt"
              v-model="countValue"
              v-if="tab === 0"
            >
            </v-text-field>
            <div class="text-center body-0" v-else>Quantity {{ partObj.partQty }}</div>
          </div>
          <div class="action-header mx-3">
            <div class="d-flex justify-end" v-if="tab === 0">
              <!-- <v-icon color="#ff0000" class="btn-icon">mdi-heart </v-icon> -->
              <v-tooltip top color="primary" content-class="top">
                <!-- <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" class="pb-2 body-1 primary--text" @click="onPartSaved('INSAVED')">
                <v-icon color="#c4c4c4" class="btn-icon">mdi-heart </v-icon>
              </div>
            </template> -->
                <div class="text-center">Saved for Later</div>
              </v-tooltip>
              <!-- <v-icon color="#c4c4c4" class="ml-5 btn-icon">mdi-trash-can </v-icon> -->
              <div class="ml-5">
                <v-tooltip top color="primary" content-class="top">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on" class="pb-2 body-1 primary--text" @click="onPartDeleted">
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
                    <div v-bind="attrs" v-on="on" class="pb-2 body-1 primary--text" @click="onPartDeleted">
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

        <div class="detail-container mx-n3 d-flex">
          <div class="mx-3 left-detail">
            <div class="my-1 text-subtitle-2">ESTIMATING PRICE</div>
            <div class="text-caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eu dolor faucibus, laoreet magna sed,
              porttitor nulla...
            </div>
            <div class="text-caption font-weight-medium mt-2">Size: 300</div>
            <div class="text-caption font-weight-medium">Color: red</div>
          </div>
          <div class="mx-3 right-detail">
            <div class="mt-10 primary--text" v-if="tab !== 2">
              <div class="text-end mb-3">{{ partObj.partPrice | currency }}</div>
              <div class="text-end">Subtotal > {{ subTotal | currency }}</div>
            </div>
          </div>
        </div>

        <div class="kit-container">
          <template v-if="tab !== 2">
            <div class="d-flex flex-nowrap align-end ml-2 mx-n1">
              <div class="kit-ipt">
                <v-text-field placeholder="Add to Kit" hide-details class="rounded-10 mx-1" v-model.trim="kitValue">
                </v-text-field>
              </div>
              <v-btn @click="onAddKitClicked" class="kit-btn mx-1 rounded-10" large color="braap_orange" dark
                >Add</v-btn
              >
            </div>

            <div class="mt-3">
              <v-chip
                v-for="kit in partObj.tags"
                :key="kit.id"
                class="ma-2 text-caption"
                close
                color="primary"
                label
                @click:close="onDeleteChipClicked(kit)"
              >
                {{ kit.tagName }}
              </v-chip>
            </div>
          </template>
        </div>

        <div class="d-flex mx-n3 justify-space-between mt-3 primary--text" v-if="tab === 2">
          <div class="mx-3">{{ partObj.partPrice | currency }}</div>
          <div class="mx-3">Subtotal > {{ subTotal | currency }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'CartPartCard',
    props: ['partObj'],
    data() {
      return {
        countValue: 1,
        kitValue: '',
        innerImg: ''
      }
    },
    created() {
      this.countValue = this.partObj.partQty
      this.innerImg = this.partObj.partImage
    },
    computed: {
      ...mapState({
        tab: state => state.cart.tab
      }),
      subTotal() {
        return this.partObj.partQty * this.partObj.partPrice
      }
    },
    methods: {
      onCountChanged() {
        if (!this.countValue) {
          this.countValue = this.partObj.partQty
          return
        }
        if (this.countValue * 1 !== this.partObj.partQty) {
          console.log(this.countValue)
          this.$axios.post(`/api/cart/items/${this.partObj.cartItemId}/Qty/${this.countValue}`).then(result => {
            if (result.success && result.data) {
              this.$store.commit('cart/changePartCount', {
                countValue: this.countValue,
                vehicleId: this.partObj.vehicleId,
                vehicleWorkId: this.partObj.vehicleWorkId,
                cartItemId: this.partObj.cartItemId
              })
            }
          })
        }
      },
      onAddKitClicked() {
        if (
          this.kitValue !== '' &&
          !this.partObj.tags.find(item => item.tagName.toUpperCase() === this.kitValue.toUpperCase())
        ) {
          // const { vehicleId, vehicleWorkId, cartItemId } = this.partObj
          const { vehicleId, vehicleWorkId, cartItemId } = this.partObj
          this.$axios.post(`/api/cart/items/${cartItemId}/Tag/Add/${this.kitValue}`).then(result => {
            if (result.success && result.data) {
              // this.getCartData()
              this.$store.commit('cart/addToKit', { vehicleId, vehicleWorkId, cartItemId, newTag: result.data })
            }
          })
        }
        this.kitValue = ''
      },
      onDeleteChipClicked(kit) {
        const { vehicleId, vehicleWorkId } = this.partObj
        const { id, cartItemId } = kit
        this.$axios.post(`/api/cart/items/${cartItemId}/Tag/Delete/${id}`).then(result => {
          if (result.success && result.data) {
            this.$store.commit('cart/deleteKit', { id, vehicleId, vehicleWorkId, cartItemId })
          }
        })
      },
      getCartData() {
        this.$store.dispatch('cart/getCartListItems')
        this.$store.dispatch('cart/getHistoryListItems')
        this.$store.dispatch('cart/getSavedListItems')
      },
      onPartSaved(status) {
        this.$axios.post(`/api/cart/Items/${this.partObj.cartItemId}/Status/${status}`)
        this.getCartData()
      },
      onPartDeleted() {
        this.$axios.post(`/api/cart/items/delete/${this.partObj.cartItemId}`).then(result => {
          if (result.success && result.data) {
            this.getCartData()
          }
        })
      },
      openDetail() {
        this.$emit('open-detail', this.partObj)
      }
    },
    watch: {
      countValue(val, oldVal) {
        // this.countValue = this.countValue * 1
        if (val && !/^[1-9]\d?$/.test(val.toString())) {
          this.$nextTick(() => {
            this.countValue = oldVal
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .cart-part-card {
    width: 100%;
    border: 1px solid $braap_light_grey;
    translate: 0.3s;
    position: relative;
    background: #fbfbfb;
    transition: 0.3s;
    &:hover {
      box-shadow: var(--theme-shadow);
    }
    &::before {
      content: '';
      border: 1px solid $braap_light_grey;
      border-top-color: transparent;
      border-right-color: transparent;
      width: 20px;
      height: calc(50% + 220px);
      position: absolute;
      bottom: 50%;
      left: -20px;
    }

    .price-container {
      flex-basis: 80%;
    }

    .search-ipt {
      input {
        text-align: center;
      }
    }

    .img-container {
      flex-basis: 16.6%;
      .add-border {
        border: 1px solid $braap_light_grey;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
    }

    .border-none {
      border: none !important;
    }

    .right-container {
      flex-basis: 83.4%;
      .header-container {
        .info-header {
          flex-basis: 60%;
          .header-link:hover {
            text-decoration: underline;
          }
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
      .kit-container {
        .kit-ipt {
          flex-basis: 45%;
          .v-input__slot {
            min-height: 40px !important;
            .v-input__prepend-inner {
              margin-top: 3px !important;
            }
            .v-input__append-inner {
              margin-top: 3px !important;
            }
            .v-text-field__slot {
              input {
                font-size: 12px !important;
                padding-left: 0;
                padding-bottom: 0px;
                color: #000;
              }
            }
          }
        }
        .kit-btn {
          flex-basis: 10%;
        }

        .v-chip {
          font-size: 12px !important;
          margin-left: 0px !important;
          margin-right: 6px !important;
          padding-left: 6px !important;
          padding-right: 8px !important;
          border-radius: 6px !important;
        }
      }
    }
  }
</style>