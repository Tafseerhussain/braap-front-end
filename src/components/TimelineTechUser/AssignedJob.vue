<template>
  <div class="job-item" v-if="this.counter >= 60">
    <div class="event-item line-indicator">
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
        <div class="content color-40">
          <span> <b>Job:</b> {{ job.machine }} </span>
          <span v-for="d in job.diagnostics" :key="d.id">
            Diagnostic: <a class="color-40">{{ d.name }}</a>
          </span>
        </div>
      </div>
      <div class="counter">{{ counterHour }}:{{ counterMinutes > 9 ? counterMinutes : '0' + counterMinutes }}</div>
    </div>
    <div v-if="!showDeclineForm" class="event-item line-indicator pt-5">
      <div class="event-meta"></div>
      <div class="event-title">
        <div class="content color-40">
          <div class="btn-wrapper">
            <v-btn color="success" small elevation="2" @click="accept">Accept job</v-btn>
            <v-btn color="#a6a6a6" small elevation="2" @click="showDeclineForm = true">Decline</v-btn>
          </div>
        </div>
      </div>
    </div>
    <template v-else>
      <div class="event-item line-indicator pt-5">
        <div class="event-meta"></div>
        <div class="event-title">
          <div class="content color-40">
            <v-select
              :items="reasons"
              v-model="reason"
              background-color="error"
              label="Select reason"
              solo
              small
            ></v-select>

            <p>
              <b>IMPORTANT: </b>
              Braap assigned jobs based on our understanding of your skill set and availability. To continue receiving
              jobs your must keep you calendar and skills up to data.
              <a>Click here to update</a>.
            </p>

            <div class="btn-wrapper">
              <v-btn color="success" small elevation="2" @click="decline">CONFIRM</v-btn>
              <v-btn color="#a6a6a6" small elevation="2" @click="showDeclineForm = false">GO BACK</v-btn>
            </div>

            <p class="reject-info color-a4" v-if="declineJobThisYear > 0">
              You have rejected {{ declineJobThisYear }} {{ declineJobThisYear > 1 ? 'jobs' : 'job' }} so far this
              year<template v-if="declineJobInBraap != declineJobThisYear">
                and {{ declineJobInBraap }} jobs since working on the platform</template
              >.
            </p>
            <p class="reject-info color-a4" v-else-if="declineJobInBraap > 0">
              You have rejected {{ declineJobInBraap }} {{ declineJobInBraap > 1 ? 'jobs' : 'job' }} so far since
              working on the platform.
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'ReviewJobs',
    props: {
      job: {
        type: Object,
        default: function() {
          return {}
        }
      },
      declineJobThisYear: {
        type: Number
      },
      declineJobInBraap: {
        type: Number
      },
      reasons: {
        type: Array
      }
    },
    components: {},
    data: function() {
      return {
        showDeclineForm: false,
        reason: 'Not my skill set',
        counter: 0,
        timer: null
      }
    },
    created() {
      if (this.job) {
        this.startTimer()
      }
      if (this.reasons && this.reasons.length > 0) this.reason = this.reasons[0]
    },
    watch: {
      job(value) {
        if (value) {
          this.startTimer()
        }
      },
      reasons(value) {
        if (value && value.length > 0) {
          this.reason = value[0]
        }
      }
    },
    computed: {
      counterDuration() {
        return moment.duration(this.counter, 's')
      },
      counterHour() {
        return this.counterDuration.hours()
      },
      counterMinutes() {
        return this.counterDuration.minutes()
      }
    },
    methods: {
      moment,
      startTimer() {
        this.counter = moment
          .duration(
            moment(this.job.createdTime)
              .add(10, 'h')
              .diff(moment())
          )
          .asSeconds()
        if (this.timer) clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.counter = this.counter - 60
          if (this.counter < 60) {
            this.$emit('remove', this.job)
            clearInterval(this.timer)
          }
        }, 60 * 1000)
      },
      accept() {
        var $this = this
        $this.$axios.post('/Timeline/AcceptJobs', { jobIds: [$this.job.id] }).then(result => {
          if (result && result.status === 200) {
            this.$emit('accepted', this.job)
          }
        })
      },
      decline() {
        var $this = this
        $this.$axios.post('/Timeline/DeclineJob', { jobId: $this.job.id, reason: $this.reason }).then(result => {
          if (result && result.status === 200) {
            this.$emit('declined', this.job)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .job-item {
    .event-item {
      .event-title {
        .content {
          a {
            text-decoration: underline;
          }
        }
      }
      &.pt-5 {
        padding-top: 5px !important;
      }

      .btn-wrapper {
        padding: 0 0 10px 0;
        .v-btn {
          width: 120px;
          color: #fff;
        }
        .v-btn + .v-btn {
          margin-left: 15px;
        }
      }
      .reject-info {
        font-size: 12px;
        position: relative;
        padding-top: 15px;
        padding-left: 10px;
        width: 260px;

        &:before {
          content: ' ';
          display: block;
          width: 1px;
          height: 10px;
          top: 0px;
          left: 15px;
          position: absolute;
          background-color: #a4a4a4;
        }
      }
    }
    .counter {
      align-self: flex-start;
    }

    .v-input__control {
      max-width: 255px;
      min-height: 28px !important;
      .v-label {
        color: #fff !important;
        font-size: 14px;
      }
      .v-input {
        color: #fff !important;
      }
      .v-select__selections {
        color: #fff !important;
      }
      .v-icon {
        color: #fff !important;
      }
      .v-text-field__details {
        min-height: 0 !important;
        height: 0;
      }
    }
  }
</style>
