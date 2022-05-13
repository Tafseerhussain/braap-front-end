<template>
  <v-card
    class="d-flex flex-column mx-4 mb-6 mb-sm-8 pa-3 pb-0 primary--text machine-item"
    :class="{ selected: selected }"
    ref="card"
  >
    <v-overlay absolute opacity="0" :value="readonly" style="cursor: pointer"></v-overlay>
    <v-overlay absolute opacity="0" :value="machine.IsDeleted" style="cursor: not-allowed"></v-overlay>
    <div class="d-flex align-center">
      <v-btn icon small @click="setFavorate" :disabled="readonly">
        <svg xmlns="http://www.w3.org/2000/svg" width="24.486" height="24.223" viewBox="0 0 30.486 29.223">
          <g id="star" transform="translate(-598 -568)">
            <path
              id="fill-star"
              data-name="fill-star"
              d="M599.713,580.618l8.216-2.72,5.44-8.159,3.966,8.159,8.953,3-6.063,6.176.567,8.046-7.933-3.91-7.989,3.91.623-8.613Z"
              :fill="!machine.IsFavourite ? '#FFF' : '#FFEA00'"
            />
            <path
              id="star-frame"
              data-name="star-frame"
              d="M21.575,12.062c-3.8-9.248-4.929-9.248-5.536-9.248-.558,0-1.708,0-5.849,9.12-8.645,1.514-8.99,2.537-9.152,3.034-.188.563-.534,1.6,6.278,7.106-1.783,8.6-.716,9.19-.2,9.478a1.374,1.374,0,0,0,.676.164c1.55,0,5.941-2.808,8.247-4.357,3.324,2.214,7.265,4.679,8.348,4.678a1.1,1.1,0,0,0,.7-.237c.441-.352.988-.789-.573-9.4,7.311-6.307,7.112-6.8,6.839-7.487C31.145,14.386,30.945,13.885,21.575,12.062Zm1.282,9.248a.955.955,0,0,0-.317.9c.51,2.771.995,5.987,1.1,7.575-1.5-.767-4.513-2.652-7.072-4.37a.955.955,0,0,0-1.072,0,49.365,49.365,0,0,1-7.274,4.277,42.791,42.791,0,0,1,1.08-7.8.956.956,0,0,0-.338-.945A47.637,47.637,0,0,1,3.111,15.6a50.612,50.612,0,0,1,7.9-1.864.959.959,0,0,0,.711-.55A58.121,58.121,0,0,1,16.023,5,56.746,56.746,0,0,1,20,13.263a.954.954,0,0,0,.7.577c3.167.611,6.657,1.373,8.292,1.844C27.83,16.907,25.2,19.3,22.857,21.31Z"
              transform="translate(597.036 565.186)"
              :fill="!machine.IsFavourite ? '#A7ABB3' : '#FFEA00'"
            />
          </g>
        </svg>
      </v-btn>
      <div class="caption ml-4 bold d-flex align-center text-no-wrap">
        VIN | Asset ID
        <v-text-field
          solo
          hide-details
          dense
          flat
          class="ml-3 vin-input"
          placeholder="Enter VIN | Asset ID"
          v-model="machine.VIN"
          @change="updateVIN"
          @keydown.enter="(e) => e.target.blur()"
          v-if="machine.VIN || !readonly"
        ></v-text-field>
      </div>
      <template v-if="!readonly">
        <v-tooltip left color="primary" max-width="310" open-delay="100">
          <template v-slot:activator="{ on, attrs }">
            <v-hover v-slot="{ hover }">
              <v-btn
                v-if="!machine.IsDeleted"
                icon
                small
                :color="hover ? 'braap_red' : 'primary'"
                class="ml-auto mr-n1"
                @click="onRemoveClick"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-btn
                v-else
                absolute
                right
                icon
                small
                class="ml-auto mr-n2"
                style="z-index: 6"
                @click="revertVehicle"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-history</v-icon>
              </v-btn>
            </v-hover>
          </template>
          {{ machine.IsDeleted ? 'Restore the machine' : removeTooltip }}
        </v-tooltip>
      </template>
    </div>
    <v-img
      :src="'/workshop/vehicleimage?vehicleId=' + machine.Id"
      aspect-ratio="1.5"
      cover
      class="my-2 flex-grow-0"
    ></v-img>
    <!-- <div class="mb-1 body-2 font-weight-medium braap_grey--text" v-if="machine.UserCustomerName">
      {{ machine.UserCustomerName }}
    </div> -->
    <div class="d-flex mb-2 body-2 align-start font-weight-medium">
      <span style="cursor: pointer; line-height: 16px; margin-top: 2px" class="mr-2">
        {{ machine.FullName }}
      </span>
      <v-tooltip top color="primary" max-width="200" open-delay="100">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            x-small
            v-bind="attrs"
            v-on="on"
            :disabled="!machine.Location && readonly"
            @click="goToWorkshop(machine.Id)"
          >
            <v-icon color="braap_red" small>$svg-location</v-icon>
          </v-btn>
        </template>
        <span v-if="machine.Location">{{ machine.Location }}</span>
        <span v-else>CLICK TO SET LOCATION</span>
      </v-tooltip>
    </div>
    <v-spacer></v-spacer>
    <div class="text-right" v-if="!readonly">
      <a @click.prevent="openTimeline">Go to Timeline </a>
      <v-icon color="primary">mdi-arrow-right-thin</v-icon>
    </div>
    <div class="d-flex mx-n3" v-if="!readonly">
      <v-btn @click="openWorkplace" dark block large class="caption rounded-t-0 font-weight-medium">
        INTERACTIVE WORKSPACE <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
    <div class="d-flex mx-n3" v-else>
      <v-btn @click="select" dark block large class="caption rounded-t-0 font-weight-medium">
        SELECT MACHINE | ASSET <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
  export default {
    name: 'Machine',
    props: {
      value: {
        type: Object,
        required: true
      },
      selected: {
        type: Boolean
      },
      readonly: {
        type: Boolean
      },
      removeTooltip: {
        type: String,
        default: 'Move to recycling bin'
      }
    },
    data: function() {
      return {
        machine: {}
      }
    },
    watch: {
      value(val) {
        this.machine = val
      }
    },
    computed: {},
    created() {
      if (this.value) this.machine = this.value
    },
    mounted() {
      if (this.readonly) this.$refs.card.$on('click', this.select)
    },
    methods: {
      setFavorate() {
        this.$axios
          .post('/MyShop/MarkVehicleAsFavrouite', {
            vehicleId: this.machine.Id
          })
          .then(result => {
            if (result && result.status === 200 && result.data) {
              this.machine.IsFavourite = !this.machine.IsFavourite
            }
          })
      },
      revertVehicle() {
        this.$emit('restore', this.machine)
      },
      onRemoveClick() {
        this.$emit('remove', this.machine)
      },
      updateVIN() {
        this.$axios
          .post('/MyShop/InsertUserVehicle', {
            id: this.machine.Id,
            vin: this.machine.VIN
          })
          .then(() => {})
      },
      checkUserVehicleLimitStatus() {
        return new Promise((resolve, reject) => {
          this.$axios.post('/MyShop/CheckUserVehicleLimitStatus').then(result => {
            if (result && result.status === 200 && result.data) {
              if (result.data.StatusText === 'EXCEEDLIMIT') {
                window.location.href = '/Myshop/PurchaseMachineAccess'
              } else {
                resolve()
              }
            } else {
              reject()
            }
          })
        })
      },
      openWorkplace() {
        if (this.machine.IsDeleted) return
        this.checkUserVehicleLimitStatus().then(() => {
          window.location.href = '/Workshop/' + this.machine.Id
        })
      },
      openTimeline() {
        if (this.machine.IsDeleted) return
        this.checkUserVehicleLimitStatus().then(() => {
          this.$emit('select', this.machine)
        })
      },
      editMachine() {
        if (this.machine.IsDeleted) return
        this.checkUserVehicleLimitStatus().then(() => {
          this.$emit('edit', this.machine)
        })
      },
      select() {
        this.$emit('select', this.machine)
      },
      goToWorkshop(id) {
        window.location.href = '/workshop/' + id + '?tab=1'
      }
    }
  }
</script>

<style lang="scss">
  .machine-item {
    flex-basis: 362px;
    @media (max-width: 2000px) {
      flex-basis: calc(20% - 32px) !important;
    }
    @media (max-width: 1700px) {
      flex-basis: calc(25% - 32px) !important;
    }
    @media (max-width: 1280px) {
      flex-basis: calc(33.3333% - 32px) !important;
    }
    @media (max-width: 1020px) {
      flex-basis: calc(50% - 32px) !important;
    }
    @media (max-width: 650px) {
      flex-basis: calc(100% - 32px) !important;
    }

    .vin-input {
      .v-input__control {
        min-height: 30px !important;
      }
      .v-text-field__slot {
        input {
          padding: 0 !important;
          font-size: 12px !important;
          color: rgba(0, 0, 0, 0.87) !important;
        }
      }
    }

    &.selected:after {
      content: '';
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      position: absolute;
      background-color: rgba(255, 255, 255, 0.5);
      z-index: 4;
      background-image: url(/braap/img/icons/tick_grey.svg);
      background-repeat: no-repeat;
      background-size: 100px;
      background-position: center;
    }

    .machine-address {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>