<template>
  <div class="timeline d-flex pa-0 pa-md-1">
    <v-card elevation="2" outlined class="d-flex flex-column flex-grow-1">
      <v-btn absolute top right icon small class="mt-n2 mr-n2" @click="closeDrawer">
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
      <div class="header pa-4">
        <v-tooltip bottom color="primary" max-width="300" nudge-left="120" open-delay="300">
          <template v-slot:activator="{ on, attrs }">
            <div class="d-flex align-center mb-2 pr-4" v-bind="attrs" v-on="on">
              <v-icon v-if="autoPilot" color="#3bb300" @click="setAutoPilot(false)">$svg-on</v-icon>
              <v-icon v-else color="#a4a4a4" @click="setAutoPilot(true)">$svg-on</v-icon>
              <span>Timeline for {{ vehicle.vehicleName }}</span>
            </div>
          </template>
          <span v-if="autoPilot"
            >Timeline auto pilot is on and helps streamline critical events. Click the green icon to turn off
            automation.</span
          >
          <span v-else>Timeline auto pilot is off. Click the gray icon to turn on the automation.</span>
        </v-tooltip>
        <div class="d-flex align-center">
          <v-text-field
            outlined
            rounded
            solo
            flat
            dense
            hide-details
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            class="mr-2"
          ></v-text-field>
          <v-menu offset-y bottom left nudge-top="-5" content-class="add-diagnostic">
            <template v-slot:activator="{ on, attrs }">
              <v-btn rounded elevation="0" dark v-bind="attrs" v-on="on" :disabled="addBtnDisabled"> Add </v-btn>
            </template>
            <v-list>
              <v-list-item link @click="addDiagnostic">ADD DIAGNOSTIC</v-list-item>
              <v-list-item link @click="addPart">ADD PART</v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
      <perfect-scrollbar
        ref="ps"
        class="event-container flex-grow-1 pl-4 pr-4 pb-4"
        :options="{ suppressScrollX: true }"
      >
        <div ref="psContent" class="d-flex flex-column align-end justify-end">
          <div v-if="activities.length <= 2" class="placeholder flex-grow-1 ml-auto mr-auto d-flex align-center">
            <img src="../../assets/Timeline Graphic Starter.jpeg" />
          </div>
          <div class="ma-auto pt-2 pb-2" v-intersect.quiet="loadMore" v-if="showMore">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <component
            v-for="item in activities"
            :key="item.id"
            :is="item.type"
            v-bind="{ ...vehicle, ...item.props }"
            @change="updateActivities"
            @height-change="scrollToBottom"
            @reload="reload"
          ></component>
        </div>
      </perfect-scrollbar>
    </v-card>
    <transition name="scale-transition">
      <v-btn
        fab
        x-small
        dark
        bottom
        absolute
        right
        class="mb-8 mr-2"
        transition="scale-transition"
        v-show="showToBottom"
        @click="scrollToBottom"
        ><v-icon dark>mdi-chevron-down</v-icon></v-btn
      >
    </transition>
  </div>
</template>

<script>
  import AutoPilot from './Items/AutoPilot.vue'
  import SelectMaintenance from './Items/SelectMaintenance.vue'
  import UpdateMaintenance from './Items/UpdateMaintenance.vue'
  import Timezone from './Items/Timezone.vue'
  import AddDiagnostic from './Items/AddDiagnotic'
  import AddPart from './Items/AddPart'
  import Message from './Items/Message'
  import MaintenanceAlreadySetup from './Items/MaintenanceAlreadySetup'
  import PaymentProcessed from './Items/PaymentProcessed'
  import PaymentFailed from './Items/PaymentFailed'

  export default {
    name: 'TimelineChat',
    components: {
      AutoPilot,
      SelectMaintenance,
      UpdateMaintenance,
      Timezone,
      AddDiagnostic,
      AddPart,
      Message,
      MaintenanceAlreadySetup,
      PaymentProcessed,
      PaymentFailed
    },
    data: function() {
      return {
        showToBottom: false,
        showMore: false,
        pageSize: 10,
        vehicle: {},
        activities: [],
        machineName: null,
        autoPilot: false,
        addBtnDisabled: true
      }
    },
    computed: {
      vehicleId() {
        return this.vehicle.vehicleId
      }
    },
    mounted() {
      this.$refs.ps.$el.addEventListener('ps-scroll-y', event => {
        if (event.target.scrollTop < event.target.scrollHeight - event.target.offsetHeight - 50) {
          this.showToBottom = true
        } else {
          this.showToBottom = false
        }
      })
      this.$refs.ps.$el.addEventListener('ps-y-reach-end', event => {
        if (event.target.classList.contains('ps--scrolling-auto')) {
          event.target.classList.remove('ps--scrolling-y')
          event.target.classList.remove('ps--scrolling-auto')
        }
      })
      this.$root.scrollTimelineToBottom = this.scrollToBottom
      this.$root.updateTimelineAddBtn = val => (this.addBtnDisabled = val)
    },
    methods: {
      loadTimeline(vehicleId) {
        this.activities = []
        this.$axios
          .get('/Timeline/GetActivities', {
            params: { vehicleId }
          })
          .then(result => {
            if (result && result.status === 200 && result.data) {
              if (!this.$cookie.get('BRAAP_TimezoneConfirmed')) {
                result.data.activities.splice(0, 0, { type: 'Timezone' })
              }
              this.activities = result.data.activities
              this.vehicle = result.data.vehicle
              this.autoPilot = result.data.vehicle.autoPilot
              this.addBtnDisabled = !result.data.maintenance
              this.showMore = result.data.activities.length >= this.pageSize
              this.scrollToBottom()
            }
          })
      },
      updateActivities({ event, action, activity }) {
        if (activity) {
          var enableOrDisableActivity = (activity, disabled) => {
            if (activity.disabledId) {
              let item = this.activities.find(x => x.id == activity.disabledId)
              if (item) item.props.disabled = disabled
            }
          }
          // process activity change
          var index = this.activities.findIndex(x => x.id == activity.id)
          switch (action) {
            case 'update':
              if (index >= 0) this.activities.splice(index, 1, activity)
              break
            case 'remove':
              if (index >= 0) {
                enableOrDisableActivity(this.activities[index], false)
                this.activities.splice(index, 1)
              }
              break
            case 'add':
              enableOrDisableActivity(activity, true)
              this.activities.push(activity)
              break
          }
        }

        // handle event from activity
        switch (event) {
          case 'auto-pilot':
            this.autoPilot = activity.props.autoPilot
            break
          case 'select-maintenance':
            this.addBtnDisabled = false
            break
          case 'cancel-maintenance':
            this.addBtnDisabled = true
            break
          case 'diagnostic-adding':
          case 'part-adding':
            this.addBtnDisabled = true
            break
          case 'diagnostic-added':
          case 'diagnostic-canceled':
          case 'part-added':
          case 'part-canceled':
            this.addBtnDisabled = false
            break
        }

        this.scrollToBottom()
      },
      scrollToBottom() {
        this.showToBottom = false
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.ps.ps.update()
            this.$refs.ps.$el.classList.add('ps--scrolling-auto')
            this.$refs.ps.$el.scrollTop = this.$refs.psContent.offsetHeight + 500
          }, 100)
        })
      },
      loadMore(entries, observer, isIntersecting) {
        if (!isIntersecting) return
        var height = this.$refs.psContent.offsetHeight

        setTimeout(() => {
          var dateBefore = this.activities[0].created
          this.$axios
            .get('/Timeline/GetActivities', {
              params: { vehicleId: this.vehicleId, dateBefore }
            })
            .then(result => {
              if (result && result.status === 200 && result.data) {
                if (result.data.activities.length > 0) {
                  this.activities = result.data.activities.concat(this.activities)
                  this.$nextTick(() => {
                    this.$refs.ps.$el.scrollTop = this.$refs.psContent.offsetHeight - height
                  })
                }
                this.showMore = result.data.activities.length >= this.pageSize
              }
            })
        }, 300)
      },
      setAutoPilot(value) {
        this.$axios
          .post('/Timeline/UpdateAutoPilot', {
            vehicleId: this.vehicleId,
            autoPilot: value
          })
          .then(result => {
            if (result && result.status === 200) {
              this.autoPilot = value
            }
          })
      },
      addDiagnostic() {
        var item = this.activities[this.activities.length - 1]
        let id = new Date().valueOf()
        this.updateActivities({
          event: 'diagnostic-adding',
          action: 'add',
          activity: {
            type: 'AddDiagnostic',
            id,
            disabledId: item.id,
            props: {
              vehicleId: this.vehicleId,
              activity: {
                id,
                disabledId: item.id
              }
            }
          }
        })
      },
      addPart() {
        var item = this.activities[this.activities.length - 1]
        let id = new Date().valueOf()
        this.updateActivities({
          event: 'part-adding',
          action: 'add',
          activity: {
            type: 'AddPart',
            id,
            disabledId: item.id,
            props: {
              vehicleId: this.vehicleId,
              activity: {
                id,
                disabledId: item.id
              }
            }
          }
        })
      },
      reload() {
        this.loadTimeline(this.vehicle.vehicleId)
      },
      closeDrawer() {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';

  .add-diagnostic {
    .v-list-item--link {
      white-space: nowrap;
    }
  }

  .timeline {
    font-family: Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100vh;
    font-size: 16px;
    letter-spacing: -0.3px;
    position: relative;

    .max-width-400 {
      max-width: 400px;
    }

    .header {
      .v-input__slot {
        padding-left: 10px !important;
        margin-bottom: 0 !important;
      }
      .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
        background-color: $braap_grey !important;
        color: #fff !important;
        cursor: not-allowed;
        pointer-events: initial;
        &:before {
          opacity: 0;
        }
      }
    }

    .event-container {
      min-height: 300px;
      max-height: calc(100vh - 10px);
      overflow: auto;

      a {
        text-decoration: underline;
      }

      & > div {
        min-height: 100%;
        .placeholder {
          img {
            max-width: 350px;
            margin-bottom: 20px;
          }
        }
      }
    }

    .not-allowed {
      .action,
      .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
        cursor: not-allowed;
        pointer-events: initial;
        &:before {
          opacity: 0 !important;
        }
      }
    }
  }
</style>
