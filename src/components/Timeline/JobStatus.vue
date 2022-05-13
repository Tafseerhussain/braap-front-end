<template>
  <div class="event-item line-indicator" v-if="activeJob">
    <div class="event-meta">
      <template v-if="!activeJob.updatedTime">
        <span class="time">{{ moment(activeJob.createdTime).format('MMM D, YYYY h:mm A') }}</span>
        <span class="user">Created by {{ activeJob.createdUser }}</span>
      </template>
      <template v-else>
        <span class="time">{{ moment(activeJob.updatedTime).format('MMM D, YYYY h:mm A') }}</span>
        <span class="user">Updated by {{ activeJob.updatedUser }}</span>
      </template>
    </div>
    <div class="event-title">
      <v-icon class="icon">$svg-status</v-icon>
      <div class="content">
        <span><b>STATUS:</b> {{ status }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'JobStatus',
    props: {
      machine: {
        type: Object,
        default: function() {
          return {}
        }
      }
    },
    data() {
      return {
        activeJob: null
      }
    },
    computed: {
      status() {
        var status = this.activeJob ? this.activeJob.status : ''
        if (status === 'NEW') return 'New'
        if (status === 'PENDING_PAYMENT') return 'Pending Payment'
        if (status === 'TECHNICIAN_REVIEW') return 'Technician Review'
        return ''
      },
      vehicleId() {
        return this.machine ? this.machine.vehicleId : null
      }
    },
    mounted() {
      if (this.vehicleId) this.getActiveJobStatus()
    },
    watch: {
      vehicleId() {
        if (this.vehicleId) this.getActiveJobStatus()
      }
    },
    methods: {
      moment,
      getActiveJobStatus() {
        var $this = this
        $this.$axios
          .post('/Timeline/getActiveJobStatus', {
            vehicleId: $this.machine.vehicleId
          })
          .then(result => {
            if (result && result.status === 200) {
              if (result.data) $this.activeJob = result.data
              else {
                $this.activeJob = {
                  createdTime: moment(),
                  createdUser: 'Braap Engine',
                  status: 'TECHNICIAN_REVIEW'
                }
              }
            }
          })
      }
    }
  }
</script>

<style lang="scss">
</style>

