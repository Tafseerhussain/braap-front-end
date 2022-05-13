<template>
  <div class="d-flex align-center charge">
    <v-switch :ripple="false" dense hide-details inset class="ma-0 pt-3 pb-2" v-if="!this.origin" v-model="charge1">
      <template #label><slot name="label"></slot></template>
      <template #append>
        <v-tooltip top color="primary" max-width="500" open-delay="100" content-class="top">
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" style="cursor: pointer">mdi-help-circle</v-icon>
          </template>
          <slot name="tooltip"></slot>
        </v-tooltip>
      </template>
    </v-switch>
    <div v-else class="d-flex align-center py-1 body-1 value-span">
      <span class="mr-4">
        <slot name="value" v-bind="origin"></slot>
      </span>
      <v-btn color="braap_orange" dark class="rounded-10" @click="dialog = true"> Update </v-btn>
    </div>

    <v-dialog
      v-model="dialog"
      max-width="500"
      scrollable
      overlay-color="rgba(0,0,0,0.5)"
      overlay-opacity="1"
      class="elevation-0"
      persistent
      content-class="border-dialog rounded-10"
    >
      <v-card class="customer-setting-form rounded-10 overflow-hidden relative">
        <v-btn absolute small right icon class="mr-n3 mt-1" style="z-index: 1" @click="closeDialog">
          <v-icon size="28">mdi-close</v-icon>
        </v-btn>

        <div class="pt-9 px-9 text-h5 primary--text text-center">
          <slot name="title"></slot>
        </div>

        <v-card-text class="pt-5 px-9 mb-4">
          <v-form ref="form" lazy-validation>
            <v-switch :ripple="false" dense hide-details inset class="ma-0 pa-0 my-4" v-model="charge">
              <template #label><slot name="label"></slot></template>
              <template #append>
                <v-tooltip top color="primary" max-width="500" open-delay="100" content-class="top">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on" style="cursor: pointer">mdi-help-circle</v-icon>
                  </template>
                  <slot name="tooltip"></slot>
                </v-tooltip>
              </template>
            </v-switch>

            <div v-if="charge" class="pt-2">
              <v-row class="my-0">
                <v-col cols="6" class="py-0">
                  <v-select
                    v-model="model.chargeType"
                    label="Type"
                    color="braap_orange"
                    hide-details
                    class="mb-4"
                    :items="
                      type === 'OnsiteTravel'
                        ? ['Flat fee', 'Hourly rate', 'Mileage rate']
                        : ['Flat fee', 'Hourly rate']
                    "
                  ></v-select>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-text-field
                    :label="type === 'OnsiteTravel' ? 'Enter fully loaded rate' : 'Enter rate'"
                    hide-details
                    color="braap_orange"
                    class="mb-4"
                    v-model="model.rate"
                    required
                    :rules="[(v) => !!v || 'Item is required']"
                    @blur="formatRate"
                  >
                    <template #append>
                      <v-tooltip
                        v-if="type === 'OnsiteTravel'"
                        top
                        color="primary"
                        max-width="300"
                        open-delay="100"
                        content-class="top"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on" style="cursor: pointer">mdi-help-circle</v-icon>
                        </template>
                        <slot name="rateTooltip"></slot>
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row class="my-0" align="center" v-if="model.chargeType == 'Mileage rate'">
                <v-col cols="12" class="py-0">
                  <div class="d-flex align-center">
                    Miles
                    <v-switch
                      hide-details
                      :ripple="false"
                      dense
                      inset
                      v-model="model.useKilometers"
                      class="ml-4 ma-0 pt-0"
                    >
                    </v-switch>
                    Kilometers
                  </div>
                </v-col>
              </v-row>

              <v-row class="my-0" align="center" v-if="model.chargeType !== 'Flat fee'">
                <v-col cols="6" class="py-0">
                  <v-switch
                    :ripple="false"
                    dense
                    hide-details
                    inset
                    label="Setup discount"
                    class="mt-7 mb-0 pa-0 pl-1"
                    v-model="hasDiscount"
                  >
                    <template #append>
                      <v-tooltip top color="primary" max-width="300" open-delay="100" content-class="top">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on" style="cursor: pointer">mdi-help-circle</v-icon>
                        </template>
                        <slot name="discountTooltip"></slot>
                      </v-tooltip>
                    </template>
                  </v-switch>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-text-field
                    v-if="hasDiscount"
                    label="Enter % rate"
                    hide-details
                    color="braap_orange"
                    v-model="model.discountRate"
                    required
                    :rules="[(v) => !!v || 'Item is required']"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-form>

          <div class="pt-8 d-flex flex-column align-center">
            <v-btn color="primary" dark x-large @click="update" :loading="loading" class="rounded-10"> Update </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'CustomerSetting',
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
      this.$watch('model.rate', (val, oldVal) => {
        if (val && !/^\d*.?\d?\d?$/.test(val.toString())) {
          this.$nextTick(() => {
            this.model.rate = oldVal
          })
        }
      })
      this.$watch('model.discountRate', (val, oldVal) => {
        if (val && !/^[1-9]\d?$/.test(val.toString())) {
          this.$nextTick(() => {
            this.model.discountRate = oldVal
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
            this.$set(this.model, 'chargeType', 'Flat fee')
            this.$set(this.model, 'discountRate', null)
          }
        }
      }
    },
    computed: {},
    mounted() {},
    methods: {
      initModel(val) {
        this.model = { ...val }
        this.charge = this.model && this.model.chargeType && this.model.rate > 0
        this.hasDiscount = this.model.discountRate > 0
      },
      update() {
        if (this.$refs.form.validate()) {
          this.loading = true
          if (this.charge) {
            if (this.model.chargeType === 'Flat fee') {
              this.hasDiscount = false
              this.model.useKilometers = false
            }
            if (this.model.chargeType !== 'Mileage rate') {
              this.model.useKilometers = false
            }
            if (!this.hasDiscount) {
              this.model.discountRate = null
            }
          } else {
            this.hasDiscount = false
            this.model = {}
          }

          this.$axios
            .post(`/api/userCustomer/${this.customerId}/settings/update`, {
              ...this.model,
              type: this.type
            })
            .then(result => {
              if (result.success) {
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
        if (this.model && this.model.rate) {
          let value = this.model.rate.toString()
          if (value.indexOf('.') === value.length - 1) {
            value = value.split('.')[0]
          }
          value = parseFloat(value)
          this.model.rate = value === 0 ? '' : value
        }
      }
    }
  }
</script>

<style lang="scss">
  .charge {
    .value-span {
      margin-left: -3px;
    }
    margin-left: 3px;
    .customer-setting-form {
      .v-input--switch {
        & > .v-input__control {
          flex-grow: 0;
          width: auto;
        }
      }
    }
  }
</style>
