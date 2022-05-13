<template>
  <div class="tech-accept">
    <div class="event-head">
      <div class="event-meta">
        <span class="time">{{ moment(createdTime).format('MMM D, YYYY h:mm A') }}</span>
        <span class="user">Created by {{ createdUser }}</span>
      </div>
      <div class="event-title">
        {{ this.jobs.length > 0 ? 'Review new job(s)' : 'No jobs pending' }}
      </div>
    </div>
    <div class="event-history">
      <AssignedJob
        v-for="job in filteredJobs"
        :key="job.id"
        :job="job"
        :declineJobThisYear="declineJobThisYear"
        :declineJobInBraap="declineJobInBraap"
        :reasons="reasons"
        @accepted="onJobAccepted"
        @declined="onJobDeclined"
      ></AssignedJob>
      <div class="event-item line-indicator" v-if="jobs.length > 2">
        <div class="event-meta"></div>
        <div class="event-title">
          <div class="icon" v-if="!showAllJob">5</div>
          <div class="content color-40">
            <span v-if="!showAllJob">Click to review next job | <a @click="showAllJob = true">SHOW ALL</a></span>
            <span v-else><b>Quick Action: </b><a @click="acceptAllJob">Click to accpet all jobs</a></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import AssignedJob from './AssignedJob.vue'

  export default {
    name: 'ReviewJobs',
    components: {
      AssignedJob
    },
    data: function() {
      return {
        showAllJob: false,
        createdTime: new Date(),
        createdUser: 'Braap Engine',
        jobs: [],
        declineJobThisYear: 0,
        declineJobInBraap: 0,
        reasons: []
      }
    },
    computed: {
      filteredJobs() {
        return this.showAllJob ? this.jobs : this.jobs.filter((x, index) => index <= 1)
      }
    },
    created() {
      this.getPendingJobs()
      this.getDeclineReasons()
    },
    methods: {
      moment,
      onJobDeclined(job) {
        this.removeJobFromQueue(job)
        this.declineJobThisYear += 1
        this.declineJobInBraap += 1
      },
      onJobAccepted(job) {
        this.removeJobFromQueue(job)
      },
      removeJobFromQueue(job) {
        var item = this.jobs.find(x => x.id == job.id)
        if (item) this.jobs.splice(this.jobs.indexOf(item), 1)
      },
      getPendingJobs() {
        var $this = this
        $this.$axios.post('/Timeline/GetTechPendingJobs').then(result => {
          if (result && result.status === 200) {
            $this.jobs = result.data.jobs
            $this.declineJobThisYear = result.data.declineJobThisYear
            $this.declineJobInBraap = result.data.declineJobInBraap
          }
        })
      },
      getDeclineReasons() {
        var $this = this
        $this.$axios.post('/Timeline/getDeclineReasons').then(result => {
          if (result && result.status === 200) {
            $this.reasons = result.data
          }
        })
      },
      acceptAllJob() {
        var $this = this
        var jobIds = this.jobs.map(x => x.id)
        $this.$axios.post('/Timeline/AcceptJobs', { jobIds }).then(result => {
          if (result && result.status === 200) {
            this.jobs = []
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .tech-accept {
    font-size: 12px;
    position: relative;
    padding-bottom: 10px;

    .event-item {
      &:before {
        display: none !important;
      }
    }

    .icon {
      background-color: #000;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 25px;
      height: 25px;
    }
  }
</style>
