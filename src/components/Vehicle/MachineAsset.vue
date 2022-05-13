<template>
  <v-card
    class="card-wrapper px-4 pt-4 pb-12 rounded-10 relative overflow-hidden d-flex flex-column machine-asset"
    :class="{ selected: selected }"
    ref="card"
  >
    <v-overlay absolute opacity="0" :value="readonly" style="cursor: pointer" @click="select"></v-overlay>
    <v-overlay absolute opacity="0" :value="machine.isDeleted" style="cursor: not-allowed"></v-overlay>

    <v-row dense align="center" class="mb-4">
      <v-col cols="5">
        <v-btn block color="primary" class="rounded-10">VIN | Asset ID</v-btn>
      </v-col>
      <v-col cols="5">
        <v-text-field
          :outlined="!readonly"
          flat
          solo
          hide-details
          dense
          color="braap_orange"
          class="ml-3 vin-input body-2"
          placeholder="Enter VIN | Asset ID"
          v-model="machine.vin"
          @change="updateVIN"
          @keydown.enter="(e) => e.target.blur()"
          v-if="machine.vin || !readonly"
          :readonly="readonly"
        ></v-text-field>
      </v-col>
      <v-col cols="2 text-right">
        <template v-if="!readonly">
          <v-tooltip top color="primary" max-width="310" open-delay="100" content-class="top">
            <template v-slot:activator="{ on, attrs }">
              <v-hover v-slot="{ hover }">
                <v-btn
                  v-if="!machine.isDeleted"
                  icon
                  small
                  :color="hover ? 'error' : '#C4C4C4'"
                  class="ml-auto mr-n1"
                  @click="onRemoveClick"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon size="28">mdi-trash-can</v-icon>
                </v-btn>
                <v-btn
                  v-else
                  icon
                  small
                  class="ml-auto mr-n1"
                  style="z-index: 6"
                  @click="revertVehicle"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon size="28">mdi-history</v-icon>
                </v-btn>
              </v-hover>
            </template>
            {{ machine.isDeleted ? 'Restore the machine' : removeTooltip }}
          </v-tooltip>
        </template>
        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg" width="24.486" height="24.223" viewBox="0 0 30.486 29.223">
            <g id="star" transform="translate(-598 -568)">
              <path
                id="fill-star"
                data-name="fill-star"
                d="M599.713,580.618l8.216-2.72,5.44-8.159,3.966,8.159,8.953,3-6.063,6.176.567,8.046-7.933-3.91-7.989,3.91.623-8.613Z"
                :fill="!machine.isFavourite ? '#E6E6E6' : '#FFD740'"
              />
              <path
                id="star-frame"
                data-name="star-frame"
                d="M21.575,12.062c-3.8-9.248-4.929-9.248-5.536-9.248-.558,0-1.708,0-5.849,9.12-8.645,1.514-8.99,2.537-9.152,3.034-.188.563-.534,1.6,6.278,7.106-1.783,8.6-.716,9.19-.2,9.478a1.374,1.374,0,0,0,.676.164c1.55,0,5.941-2.808,8.247-4.357,3.324,2.214,7.265,4.679,8.348,4.678a1.1,1.1,0,0,0,.7-.237c.441-.352.988-.789-.573-9.4,7.311-6.307,7.112-6.8,6.839-7.487C31.145,14.386,30.945,13.885,21.575,12.062Zm1.282,9.248a.955.955,0,0,0-.317.9c.51,2.771.995,5.987,1.1,7.575-1.5-.767-4.513-2.652-7.072-4.37a.955.955,0,0,0-1.072,0,49.365,49.365,0,0,1-7.274,4.277,42.791,42.791,0,0,1,1.08-7.8.956.956,0,0,0-.338-.945A47.637,47.637,0,0,1,3.111,15.6a50.612,50.612,0,0,1,7.9-1.864.959.959,0,0,0,.711-.55A58.121,58.121,0,0,1,16.023,5,56.746,56.746,0,0,1,20,13.263a.954.954,0,0,0,.7.577c3.167.611,6.657,1.373,8.292,1.844C27.83,16.907,25.2,19.3,22.857,21.31Z"
                transform="translate(597.036 565.186)"
                :fill="!machine.isFavourite ? '#E6E6E6' : '#FFD740'"
              />
            </g>
          </svg>
        </template>
      </v-col>
    </v-row>

    <v-tooltip top color="primary" content-class="top" max-width="210">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on" class="body-0 primary--text" style="cursor: pointer">
          <span ref="fullName" class="mb-2 title" @click="editMachine">{{ machine.fullName }}</span>
        </div>
      </template>
      <div class="text-center">{{ machine.fullName }}</div>
    </v-tooltip>

    <v-img
      :src="`/api/vehicle/${machine.id}/thumbnail`"
      aspect-ratio="1.5"
      cover
      class="mt-2 mb-3 flex-grow-0 rounded-10 braap_bg_grey"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="braap_light_grey"></v-progress-circular>
        </v-row>
      </template>
    </v-img>

    <div class="py-2" v-if="!readonly">
      <v-divider></v-divider>
      <div class="pa-2 pt-3 pb-1">
        <v-row>
          <v-col :cols="6">
            <div class="d-flex flex-column align-center">
              <v-btn icon small @click="setFavorate" :disabled="readonly">
                <svg xmlns="http://www.w3.org/2000/svg" width="24.486" height="24.223" viewBox="0 0 30.486 29.223">
                  <g id="star" transform="translate(-598 -568)">
                    <path
                      id="fill-star"
                      data-name="fill-star"
                      d="M599.713,580.618l8.216-2.72,5.44-8.159,3.966,8.159,8.953,3-6.063,6.176.567,8.046-7.933-3.91-7.989,3.91.623-8.613Z"
                      :fill="!machine.isFavourite ? '#E6E6E6' : '#FFD740'"
                    />
                    <path
                      id="star-frame"
                      data-name="star-frame"
                      d="M21.575,12.062c-3.8-9.248-4.929-9.248-5.536-9.248-.558,0-1.708,0-5.849,9.12-8.645,1.514-8.99,2.537-9.152,3.034-.188.563-.534,1.6,6.278,7.106-1.783,8.6-.716,9.19-.2,9.478a1.374,1.374,0,0,0,.676.164c1.55,0,5.941-2.808,8.247-4.357,3.324,2.214,7.265,4.679,8.348,4.678a1.1,1.1,0,0,0,.7-.237c.441-.352.988-.789-.573-9.4,7.311-6.307,7.112-6.8,6.839-7.487C31.145,14.386,30.945,13.885,21.575,12.062Zm1.282,9.248a.955.955,0,0,0-.317.9c.51,2.771.995,5.987,1.1,7.575-1.5-.767-4.513-2.652-7.072-4.37a.955.955,0,0,0-1.072,0,49.365,49.365,0,0,1-7.274,4.277,42.791,42.791,0,0,1,1.08-7.8.956.956,0,0,0-.338-.945A47.637,47.637,0,0,1,3.111,15.6a50.612,50.612,0,0,1,7.9-1.864.959.959,0,0,0,.711-.55A58.121,58.121,0,0,1,16.023,5,56.746,56.746,0,0,1,20,13.263a.954.954,0,0,0,.7.577c3.167.611,6.657,1.373,8.292,1.844C27.83,16.907,25.2,19.3,22.857,21.31Z"
                      transform="translate(597.036 565.186)"
                      :fill="!machine.isFavourite ? '#E6E6E6' : '#FFD740'"
                    />
                  </g>
                </svg>
              </v-btn>
              <div
                class="text-caption"
                :class="{ 'braap_yellow--text': machine.isFavourite }"
                style="line-height: 24px"
              >
                Favorite
              </div>
            </div>
          </v-col>
          <v-col cols="6">
            <v-tooltip top color="primary" max-width="200" open-delay="100" :disabled="!machine.location">
              <template v-slot:activator="{ on, attrs }">
                <div class="d-flex flex-column align-center">
                  <v-btn icon small v-bind="attrs" v-on="on" @click="setLocation">
                    <v-icon color="">$svg-location</v-icon>
                  </v-btn>
                  <div class="text-caption" style="line-height: 24px">Click to set Location</div>
                </div>
              </template>
              <span>{{ machine.location }}</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </div>
      <v-divider></v-divider>
    </div>

    <!-- <v-spacer></v-spacer> -->
    <div class="text-center pt-4 pb-2" v-if="!readonly">
      <a @click.prevent="openTimeline" class="braap_grey--text">Go to Timeline </a>
    </div>

    <slot name="action" v-bind="{ machine }"></slot>
  </v-card>
</template>

<script>
  export default {
    name: 'MachineAsset',
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
    computed: {
      showLocation() {
        return !this.readonly || this.machine.location
      }
    },
    created() {
      if (this.value) this.machine = this.value
    },
    mounted() {},
    methods: {
      setFavorate() {
        this.$axios.post('/api/vehicle/favrouite/' + this.machine.id).then(result => {
          if (result.success && result.data) {
            this.machine.isFavourite = !this.machine.isFavourite
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
          .post('/api/vehicle/insert', {
            id: this.machine.id,
            vin: this.machine.vin
          })
          .then(() => {})
      },
      openTimeline() {
        if (this.machine.isDeleted) return
        this.$emit('select', this.machine)
      },
      editMachine() {
        if (this.machine.isDeleted) return
        this.$emit('edit', this.machine)
      },
      select() {
        this.$emit('select', this.machine)
      },
      setLocation() {
        if (this.machine.isDeleted) return
        this.$router.push({ name: 'Workshop', params: { id: this.machine.id, tab: 1 } })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  @import '@/components/Search/style.scss';

  .machine-asset {
    .vin-input {
      .v-input__control {
        min-height: 36px !important;
        .v-input__slot {
          min-height: 36px !important;
        }
      }
      .v-text-field__slot {
        input {
          padding: 0 !important;
          font-size: 12px !important;
          color: rgba(0, 0, 0, 0.87) !important;
        }
      }
    }

    .title {
      display: -webkit-box;
      line-height: 24px;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 50px;
    }

    a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>