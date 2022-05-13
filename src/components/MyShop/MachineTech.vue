<template>
  <v-card
    class="d-flex flex-column mx-4 mb-6 mb-sm-8 pa-3 pb-0 primary--text machine-item"
    :class="{ selected: selected }"
    ref="card"
  >
    <v-overlay absolute opacity="0" :value="machine.IsDeleted" style="cursor: not-allowed"></v-overlay>
    <div class="d-flex align-center">
      <div class="caption ml-4 bold d-flex align-center text-no-wrap">
        VIN | Asset ID
        <v-text-field solo hide-details dense flat class="ml-3 vin-input" v-model="machine.VIN" disabled></v-text-field>
      </div>
    </div>
    <v-img
      :src="'/workshop/vehicleimage?vehicleId=' + machine.Id"
      aspect-ratio="1.5"
      cover
      class="my-2 flex-grow-0"
    ></v-img>
    <div class="d-flex mb-2 body-2 align-start font-weight-medium">
      <span style="line-height: 16px; margin-top: 2px" class="mr-2">
        {{ machine.FullName }}
      </span>
    </div>
    <v-spacer></v-spacer>
    <div class="d-flex align-center justify-center mt-1 mb-2">
      <v-icon color="primary" class="mr-1" v-if="recent">$svg-status</v-icon
      ><span v-if="recent" class="mr-1"> Recently added |</span>
      <span v-if="!machine.TechViewed"> Requires review</span>
    </div>
    <div class="d-flex mx-n3">
      <v-btn dark block large class="caption rounded-t-0 font-weight-medium" @click.prevent="openTimeline">
        GO TO TIMELINE <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'MachineTech',
    props: {
      value: {
        type: Object,
        required: true
      },
      selected: {
        type: Boolean
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
    computed: {
      recent() {
        if (this.machine && this.machine.JobCreatedDate)
          return moment(this.machine.JobCreatedDate)
            .add(12, 'h')
            .isAfter(moment())
        return false
      }
    },
    created() {
      if (this.value) this.machine = this.value
    },
    mounted() {},
    methods: {
      openTimeline() {
        if (this.machine.IsDeleted) return
        this.$emit('select', this.machine)
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