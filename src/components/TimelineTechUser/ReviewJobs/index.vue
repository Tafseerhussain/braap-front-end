<template>
  <div class="tech-review">
    <div class="event-head">
      <div class="event-meta">
        <span class="time">{{ moment(createdTime).format('MMM D, YYYY h:mm A') }}</span>
        <span class="user">Created by {{ createdUser }}</span>
      </div>
      <div class="event-title">
        {{ this.jobs.length > 0 ? 'Job(s) accepted, complete the review.' : 'No jobs accepted' }}
      </div>
    </div>
    <div class="event-history">
      <JobDetails v-for="job in filteredJobs" :key="job.id" :job="job"></JobDetails>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import JobDetails from './JobDetails.vue'

  export default {
    name: 'AcceptedJobs',
    components: {
      JobDetails
    },
    data: function() {
      return {
        showAllJob: false,
        createdTime: new Date(),
        createdUser: 'Braap Engine',
        jobs: [
          {
            createdTime: new Date(),
            createdUser: 'Braap Engine',
            updatedTime: new Date(),
            updatedUser: 'test',
            machine: 'Dirt Bike | Honda CRX 2021',
            diagnostics: [
              {
                id: 1,
                name: 'Manufacturer Recommended Maintenance Package'
              },
              {
                id: 1,
                name: 'Manufacturer Recommended Maintenance Package'
              }
            ]
          }
        ]
      }
    },
    computed: {
      filteredJobs() {
        return this.showAllJob ? this.jobs : this.jobs.filter((x, index) => index <= 1)
      }
    },
    created() {
      // this.getPendingJobs()
    },
    methods: {
      moment,
      getPendingJobs() {
        var $this = this
        $this.$axios.post('/Timeline/GetTechPendingJobs').then(result => {
          if (result && result.status === 200) {
            $this.jobs = result.data.jobs
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .tech-review {
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
