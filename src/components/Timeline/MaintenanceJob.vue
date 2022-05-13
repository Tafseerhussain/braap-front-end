<template>
  <div class="event-item">
    <v-icon>$svg-calendar</v-icon>
    <div class="event-meta">
      <template v-if="!job.updatedTime">
        <span class="time">{{ moment(job.createdTime).format('MMM D, YYYY h:mm A') }}</span>
        <span class="user">Created by {{ job.createdUser }}</span>
      </template>
      <template v-else>
        <span class="time">{{ moment(job.updatedTime).format('MMM D, YYYY h:mm A') }}</span>
        <span class="user">Updated by {{ job.updatedUser }}</span>
      </template>
    </div>
    <div class="event-title">
      <template v-if="!job.changed">
        <div class="icon"></div>
        <div class="content">
          <span v-if="!job.removed"
            ><b>maintenance:</b>
            {{ moment(job.maintenanceDate).format('MMM D, YYYY') }}
          </span>
          <span v-else
            ><s><b>maintenance:</b> {{ moment(job.maintenanceDate).format('MMM D, YYYY') }}</s>
          </span>
        </div>
      </template>
      <template v-else>
        <v-icon class="icon">$svg-change</v-icon>
        <div class="content">
          <span
            ><s
              ><b>Original maintenance:</b>
              {{ moment(job.oldDate).format('MMM D, YYYY') }}
            </s></span
          ><span
            ><b>New Maintenance date:</b>
            {{ moment(job.newDate).format('MMM D, YYYY') }}
          </span>
        </div>
      </template>
    </div>
    <div class="event-actions" v-if="!job.removed">
      <v-menu
        v-model="datePickerOpend"
        :close-on-content-click="false"
        transition="scale-transition"
        left
        bottom
        origin="center"
      >
        <template v-slot:activator="{ on, attrs }">
          <a class="action" v-bind="attrs" v-on="on">Change</a>
        </template>
        <v-date-picker
          color="#203862"
          v-model="datePickerVal"
          :allowedDates="allowedDates"
          @input="maintenanceDateSelected"
          :landscape="true"
        ></v-date-picker>
      </v-menu>

      <span> | </span> <a class="action" @click.prevent="cancel">Cancel</a><span> | </span>
      <a class="action" @click.prevent="openChat">Get Help</a>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  // import { mapState } from 'vuex'

  export default {
    name: 'MaintenanceJob',
    props: {
      value: {
        type: Object,
        require: true,
        default: () => {}
      },
      username: {
        type: String
      }
    },
    data() {
      return {
        datePickerOpend: false,
        datePickerVal: '',
        dateRangeMin: '',
        dateRangeMax: '',
        job: {}
      }
    },
    created() {
      this.job = this.value
      this.datePickerVal = moment(this.job.maintenanceDate).format('YYYY-MM-DD')
      var date = moment(this.job.maintenanceDate)
      this.dateRangeMin = date.add(-2, 'w').toDate()
      this.dateRangeMax = date.add(4, 'w').toDate()
    },
    watch: {
      value(val) {
        if (val) {
          this.job = val
          this.datePickerVal = moment(this.job.maintenanceDate).format('YYYY-MM-DD')
        }
      },
      datePickerVal(newval, oldval) {
        if (oldval) {
          this.job.updatedTime = new Date()
          this.job.updatedUser = this.username
          this.job.newDate = newval
          this.job.oldDate = oldval
          this.job.changed = true
          this.job.maintenanceDate = newval
          this.updateJob()
        }
      }
    },
    computed: {},
    methods: {
      moment,
      allowedDates(val) {
        var date = new Date(val)
        return date >= this.dateRangeMin && date <= this.dateRangeMax && date > new Date()
      },
      maintenanceDateSelected() {
        this.datePickerOpend = false
      },
      cancel() {
        this.job.removed = true
        this.job.updatedTime = new Date()
        this.job.updatedUser = this.username
        this.job.changed = false
        this.removeJob()
      },
      openChat() {
        window.$('#zsiq_agtpic').click()
        window.$('#zsiq_maintitle').click()

        window.$('#zsiq_byline').click()
      },
      updateJob() {
        var $this = this
        $this.$axios.post('/Timeline/UpdateMaintenanceJob', $this.job).then(result => {
          if (result && result.status === 200) {
            $this.$emit('jobUpdated', $this.job)
          }
        })
      },
      removeJob() {
        var $this = this
        $this.$axios.post('/Timeline/RemoveMaintenanceJob', $this.job).then(result => {
          if (result && result.status === 200) {
            $this.$emit('jobRemoved', $this.job)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .event-item {
    display: flex;
    align-items: center;
    font-size: 12px;
    padding: 2px 0 2px 5px;
    & > .v-icon::v-deep svg {
      width: 32px;
      height: 32px;
    }

    .event-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-size: 12px;
      margin-left: 5px;
      width: 140px;
    }
    .event-title {
      flex-grow: 1;
      display: flex;
      align-items: center;
      font-size: 13px;

      .icon {
        margin-right: 5px;
      }
      s {
        color: #404040;
      }
      b {
        color: #404040;
        text-transform: uppercase;
      }
      .content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        padding: 0;
      }
    }
    .event-actions {
      flex-grow: 0;
      .action {
        cursor: pointer;
        text-decoration: none;
        transition: all 0.3s;
        border-bottom: 1px solid transparent;
        &:hover {
          border-color: #a4a4a4;
        }
      }
    }
  }
</style>
