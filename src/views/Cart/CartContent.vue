<template>
  <div class="cart-content white">
    <v-container>
      <v-row class="mb-16" v-show="isEmpty">
        <v-col cols="6" class="py-0 d-flex">
          <div class="mr-3">
            <v-menu offset-y bottom right content-class="elevation-1">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="px-7 text-subtitle-1 rounded-10" color="primary" large dark v-bind="attrs" v-on="on">
                  Machine
                  <img class="menu-img ml-3" src="/icons/chevron-down.svg" />
                </v-btn>
              </template>
              <v-list>
                <v-list-item-group color="#000">
                  <v-list-item
                    v-for="option in machineOptions"
                    :key="option.value"
                    link
                    :value="option.value"
                    class="px-3"
                    @change="onMachineChange"
                  >
                    <v-checkbox
                      hide-details
                      :ripple="false"
                      v-model="option.checked"
                      color="braap_orange"
                      class="ma-0 py-0 font-weight-medium"
                      small
                    >
                      <template #label>
                        <span class="body-2 primary--text">{{ option.text }}</span>
                      </template>
                    </v-checkbox>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </div>

          <div class="mr-3">
            <v-menu offset-y bottom right content-class="elevation-1">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="px-7 text-subtitle-1 rounded-10" color="primary" large dark v-bind="attrs" v-on="on">
                  Type
                  <img class="menu-img ml-3" src="/icons/chevron-down.svg" />
                </v-btn>
              </template>
              <v-list>
                <v-list-item-group color="#000">
                  <v-list-item
                    v-for="option in filterOptions"
                    :key="option.value"
                    link
                    :value="option.value"
                    class="px-3"
                  >
                    <v-checkbox
                      hide-details
                      :ripple="false"
                      v-model="option.checked"
                      color="braap_orange"
                      class="ma-0 py-0 font-weight-medium"
                      small
                      @change="onTypeChange"
                    >
                      <template #label>
                        <span class="body-2 primary--text">{{ option.text }}</span>
                      </template>
                    </v-checkbox>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </div>

          <div class="mr-3">
            <v-menu offset-y bottom right content-class="elevation-1">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="px-7 text-subtitle-1 rounded-10" color="primary" large dark v-bind="attrs" v-on="on">
                  Kit
                  <img class="menu-img ml-3" src="/icons/chevron-down.svg" />
                </v-btn>
              </template>
              <v-list>
                <v-list-item-group color="#000">
                  <v-list-item v-for="option in kitOptions" :key="option.value" link :value="option.value" class="px-3">
                    <v-checkbox
                      hide-details
                      :ripple="false"
                      v-model="option.checked"
                      color="braap_orange"
                      class="ma-0 py-0 font-weight-medium"
                      small
                      @change="onKitChange"
                    >
                      <template #label>
                        <span class="body-2 primary--text">{{ option.text }}</span>
                      </template>
                    </v-checkbox>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </div>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-text-field
            outlined
            hide-details
            placeholder="Search required work and related parts..."
            prepend-inner-icon="$svg-search"
            class="rounded-10 search-ipt"
            v-model="query"
            @keyup.enter="onQueryChanged"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="!isEmpty" class="empty-box d-flex justify-space-between relative mb-16">
        <div class="empty-msg">Your shopping cart is empty.</div>
        <div>
          <v-btn class="rounded-10 body-0 px-8" color="primary" dark x-large>Run a search from the home page</v-btn>
          <v-btn class="rounded-10 body-0 px-8 ml-2" color="braap_orange" x-large dark @click="goToShop"
            >Go to My Shop</v-btn
          >
        </div>
      </v-row>
      <v-row>
        <v-col cols="8" class="py-0" v-if="isEmpty">
          <div class="btn-div mb-8">
            <v-btn-toggle class="rounded-10" v-model="type" dense background-color="transparent" mandatory>
              <v-btn
                :value="0"
                x-large
                :color="type === 0 ? 'braap_orange' : 'braap_light_grey'"
                :class="{ 'white--text': type === 0 }"
                class="px-6 text-h5 body-0"
              >
                Order
              </v-btn>
              <v-btn
                :value="1"
                x-large
                :color="type === 1 ? 'braap_orange' : 'braap_light_grey'"
                :class="{ 'white--text': type === 1 }"
                class="px-6 text-h5 body-0"
                v-if="saveListItems.length > 0"
              >
                Save
              </v-btn>
              <v-btn
                :value="2"
                x-large
                :color="type === 2 ? 'braap_orange' : 'braap_light_grey'"
                :class="{ 'white--text': type === 2 }"
                class="px-6 text-h5 body-0"
              >
                History
              </v-btn>
            </v-btn-toggle>
          </div>
          <machine-card v-for="mc in filterCartList" :key="mc.machineId" :machineObj="mc"></machine-card>
        </v-col>
        <v-col cols="8" class="py-0" v-if="!isEmpty">
          <div class="order-box primary--text font-weight-bold">Order</div>
          <img src="/img/empty.png" alt="" class="empty-img" />
        </v-col>
        <v-col cols="4">
          <div class="summary-card">
            <div class="primary--text font-weight-bold boyd-1 mb-4">Order Summary</div>
            <v-divider></v-divider>
            <div class="d-flex justify-space-between py-4 text-subtitle-1 font-weight-bold primary--text">
              <div>Subtotal</div>
              <div v-if="isEmpty">{{ subtotal | currency }}</div>
              <div v-if="!isEmpty">---</div>
            </div>
            <div class="procced-btn mt-2">
              <v-btn
                v-if="isEmpty"
                x-large
                color="braap_orange"
                dark
                class="btn rounded-10 body-0 mt-10"
                @click="proceedToCheckout"
                :loading="loading"
                >Proceed to Checkout</v-btn
              >
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import MachineCard from './MachineCard.vue'
  import { mapGetters, mapState } from 'vuex'
  export default {
    name: 'CartContent',
    components: {
      MachineCard
    },
    data() {
      return {
        filterOptions: [
          { value: 'service', text: 'Service', checked: false },
          { value: 'parts', text: 'Parts', checked: false }
        ],
        query: '',
        type: 0,
        loading: false
      }
    },
    created() {
      this.getCartData()
    },
    computed: {
      ...mapState({
        selectedKits: state => state.cart.selectedKits,
        selectedType: state => state.cart.selectedType,
        selectedMachines: state => state.cart.selectedMachines,
        tab: state => state.cart.tab,
        saveListItems: state => state.cart.saveListItems,
        cartListItems: state => state.cart.cartListItems,
        historyListItems: state => state.cart.historyListItems
      }),
      ...mapGetters('cart', ['filterCartList', 'machineArr', 'kitArr', 'baseListItems', 'subtotal']),
      machineOptions() {
        let arr = []
        this.machineArr.map(item => {
          let vehicleFullname = this.baseListItems.find(f => item === f.vehicleId).vehicleFullname
          arr.push({ value: item, text: vehicleFullname, checked: false })
        })
        return arr
      },
      kitOptions() {
        return this.kitArr.map(item => {
          return { cartItemId: item.cartItemId, value: item.id, text: item.tagName, checked: false }
        })
      },
      isEmpty() {
        return this.cartListItems.length > 0
      }
    },
    methods: {
      getCartData() {
        this.$store.dispatch('cart/getCartListItems')
        this.$store.dispatch('cart/getHistoryListItems')
        this.$store.dispatch('cart/getSavedListItems')
      },
      onMachineChange() {
        let selectedMachines = this.machineOptions.filter(item => item.checked === true).map(item => item.value)
        this.$store.commit('cart/selectedMachinesChange', selectedMachines)
      },
      onTypeChange() {
        let selectedType = this.filterOptions.filter(item => item.checked === true).map(item => item.value)
        this.$store.commit('cart/selectedTypeChange', selectedType)
      },
      onKitChange() {
        let selectedKits = this.kitOptions.filter(item => item.checked === true).map(item => item.text)
        this.$store.commit('cart/selectedKitsChange', selectedKits)
      },
      goToShop() {
        this.$router.push({ name: 'MyShop' })
      },
      onQueryChanged() {
        this.$store.commit('cart/onQueryChanged', this.query)
      },
      proceedToCheckout() {
        this.loading = true
        this.$axios.post('/api/secureCheckout/processCheckout').then(result => {
          if (result.success) {
            this.$router.push({
              name: 'Checkout',
              params: {
                totalAmount: result.data.totalAmount,
                totalTax: result.data.totalTax,
                totalShipping: result.data.totalShipping,
                type: 'CHECKOUT'
              }
            })
          }
          this.loading = false
        })
      }
    },
    watch: {
      type(newVal) {
        this.$store.commit('cart/changeTab', newVal)
        this.$store.commit('cart/resetFilter')
        this.query = ''
        this.$store.commit('cart/onQueryChanged', this.query)
        this.getCartData()
        this.filterOptions.forEach(item => {
          item.checked = false
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .cart-content {
    min-height: 100vh;
    padding: 40px 0 100px 0;
    .menu-img {
      width: 16px;
      height: 16px;
    }
    .search-ipt {
      .v-input__slot {
        min-height: 50px !important;
        .v-input__prepend-inner {
          margin-top: 13px !important;
        }
        .v-input__append-inner {
          margin-top: 13px !important;
        }
      }
    }
    // .btn-div {
    //   .normal-btn {
    //     background-color: $braap_light-grey;
    //     color: $braap_grey;
    //   }
    //   .order-btn {
    //     border-radius: 10px 0 0 10px;
    //     margin-right: 1px;
    //   }
    //   .history-btn {
    //     border-radius: 0 10px 10px 0;
    //   }
    //   .active {
    //     background-color: $braap_orange !important;
    //     color: white !important;
    //   }
    // }

    .empty-img {
      display: block;
      width: 300px;
      margin: 50px auto 0 auto;
    }
    .empty-box {
      margin-top: -94px;
      padding: 18px 20px;
      border-radius: 10px;
      background: white;
      .empty-msg {
        line-height: 52px;
      }
    }

    .order-box {
      font-size: 40px;
    }
    .summary-card {
      margin-top: 112px;
      padding: 40px;
      background: #fbfbfb;
      border: 1px solid $braap_light_grey;
      transition: 0.3s;
      border-radius: 10px;
      &:hover {
        box-shadow: 0 4px 15px rgba(138, 138, 138, 0.1);
      }
      .content-border {
        border-bottom: 1px solid $braap_light_grey;
      }
      .procced-btn {
        .btn {
          width: 100%;
        }
      }
    }
  }
</style>