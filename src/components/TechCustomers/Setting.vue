<template>
  <div class="d-flex align-center">
    <v-switch :ripple="false" dense hide-details inset class="ma-0 pt-3 pb-2" v-if="!this.origin" v-model="charge1">
      <template #label><slot name="label"></slot></template>
      <template #append>
        <v-tooltip bottom color="primary" max-width="500" open-delay="100">
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" style="cursor: pointer">mdi-help-circle</v-icon>
          </template>
          <slot name="tooltip"></slot>
        </v-tooltip>
      </template>
    </v-switch>
    <div v-else class="d-flex align-center py-1 body-1">
      <span class="mr-4">
        <slot name="value" v-bind="origin"></slot>
      </span>
      <v-btn color="primary" dark elevation="0" @click="dialog = true"> Update </v-btn>
    </div>

    <v-dialog v-model="dialog" max-width="500" persistent scrollable overlay-opacity="0.8">
      <v-card class="customer-setting-form">
        <v-card-title class="primary white--text py-2 pl-3 pl-sm-6">
          <slot name="title"></slot>
          <v-btn icon small dark class="ml-auto mr-n4" @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-6 px-3 px-sm-6">
          <v-form ref="form" lazy-validation>
            <v-switch :ripple="false" dense hide-details inset class="ma-0 pa-0 my-4" v-model="charge">
              <template #label><slot name="label"></slot></template>
              <template #append>
                <v-tooltip bottom color="primary" max-width="500" open-delay="100">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on" style="cursor: pointer">mdi-help-circle</v-icon>
                  </template>
                  <slot name="tooltip"></slot>
                </v-tooltip>
              </template>
            </v-switch>

            <div v-if="charge" class="pt-2">
              <v-row dense>
                <v-col cols="6">
                  <v-select
                    v-model="model.ChargeType"
                    label=""
                    hide-details
                    dense
                    outlined
                    :items="
                      type === 'OnsiteTravel'
                        ? ['Flat fee', 'Hourly rate', 'Mileage rate']
                        : ['Flat fee', 'Hourly rate']
                    "
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    :label="type === 'OnsiteTravel' ? 'Enter fully loaded rate' : 'Enter rate'"
                    outlined
                    hide-details
                    class="mb-2"
                    dense
                    v-model="model.Rate"
                    required
                    :rules="[(v) => !!v || 'Item is required']"
                    @blur="formatRate"
                  >
                    <template #append>
                      <v-tooltip v-if="type === 'OnsiteTravel'" bottom color="primary" max-width="300" open-delay="100">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on" style="cursor: pointer">mdi-help-circle</v-icon>
                        </template>
                        <slot name="rateTooltip"></slot>
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row dense align="center" v-if="model.ChargeType == 'Mileage rate'">
                <v-col cols="12">
                  <v-switch
                    hide-details
                    dense
                    :ripple="false"
                    small
                    inset
                    v-model="model.UseKilometers"
                    class="my-2 pa-0 ml-1 inverse-switch"
                  >
                    <template v-slot:label>
                      <span>Use kilometers instead of miles</span>
                    </template>
                  </v-switch>
                </v-col>
              </v-row>

              <v-row dense align="center" v-if="model.ChargeType !== 'Flat fee'">
                <v-col cols="6">
                  <v-switch
                    :ripple="false"
                    dense
                    hide-details
                    inset
                    label="Setup discount"
                    class="my-2 pa-0 pl-1"
                    v-model="hasDiscount"
                  >
                    <template #append>
                      <v-tooltip bottom color="primary" max-width="300" open-delay="100">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on" style="cursor: pointer">mdi-help-circle</v-icon>
                        </template>
                        <slot name="discountTooltip"></slot>
                      </v-tooltip>
                    </template>
                  </v-switch>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-if="hasDiscount"
                    label="Enter % rate"
                    outlined
                    hide-details
                    dense
                    v-model="model.DiscountRate"
                    required
                    :rules="[(v) => !!v || 'Item is required']"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-form>
        </v-card-text>
        <div class="d-flex align-center justify-end pb-6 px-3 px-sm-6 pt-0">
          <v-btn color="braap_green" dark large :loading="loading" elevation="0" @click="update"> Update </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Setting',
    props: {
      value: {
        type: Object
      },
      customerId: {
        type: String
      },
      type: {
        type: String
      }
    },
    components: {},
    data: function() {
      return {
        loading: false,
        dialog: false,
        set: false,
        charge1: false,
        charge: false,
        hasDiscount: false,
        origin: null,
        model: {}
      }
    },
    created() {
      this.$watch('model.Rate', (val, oldVal) => {
        console.log(this)
        if (val && !/^\d*.?\d?\d?$/.test(val.toString())) {
          this.$nextTick(() => {
            this.model.Rate = oldVal
          })
        }
      })
      this.$watch('model.DiscountRate', (val, oldVal) => {
        if (val && !/^[1-9]\d?$/.test(val.toString())) {
          this.$nextTick(() => {
            this.model.DiscountRate = oldVal
          })
        }
      })
    },
    watch: {
      value(val) {
        if (val) {
          this.origin = { ...val }
          this.initModel(val)
        }
      },
      charge1(val) {
        if (val) {
          this.dialog = true
        }
      },
      dialog(val) {
        if (val) {
          if (this.origin) this.initModel(this.origin)
          else {
            this.charge = true
            this.hasDiscount = false
            this.$set(this.model, 'ChargeType', 'Flat fee')
            this.$set(this.model, 'DiscountRate', null)
          }
        }
      }
    },
    computed: {},
    mounted() {},
    methods: {
      initModel(val) {
        this.model = { ...val }
        this.charge = this.model && this.model.ChargeType && this.model.Rate > 0
        this.hasDiscount = this.model.DiscountRate > 0
      },
      update() {
        if (this.$refs.form.validate()) {
          this.loading = true
          if (this.charge) {
            if (this.model.ChargeType === 'Flat fee') {
              this.hasDiscount = false
              this.model.UseKilometers = false
            }
            if (this.model.ChargeType !== 'Mileage rate') {
              this.model.UseKilometers = false
            }
            if (!this.hasDiscount) {
              this.model.DiscountRate = null
            }
          } else {
            this.hasDiscount = false
            this.model = {}
          }

          this.$axios
            .post('/UserCustomer/UpdateCustomerSetting', {
              ...this.model,
              type: this.type,
              userCustomerId: this.customerId
            })
            .then(result => {
              if (result && result.status === 200) {
                this.loading = false
                if (this.charge) {
                  this.origin = { ...this.model }
                } else {
                  this.origin = null
                }
                this.closeDialog()
              }
            })
        }
      },
      closeDialog() {
        this.dialog = false
        if (!this.origin) {
          this.charge1 = false
          this.charge = false
        }
      },
      formatRate() {
        if (this.model && this.model.Rate) {
          let value = this.model.Rate.toString()
          if (value.indexOf('.') === value.length - 1) {
            value = value.split('.')[0]
          }
          value = parseFloat(value)
          this.model.Rate = value === 0 ? '' : value
        }
      }
    }
  }
</script>

<style lang="scss">
  .customer-setting-form {
    .v-input--switch {
      & > .v-input__control {
        flex-grow: 0;
        width: auto;
      }
    }
  }
</style>
