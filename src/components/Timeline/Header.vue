<template>
  <div class="timeline-header">
    <div class="actions">
      <a class="action-bt"><v-icon class="mr-1" small color="#0070c1">$svg-undo</v-icon>Undo last action</a
      ><span class="ml-2 mr-1"> | </span>
      <a class="action-bt"
        ><v-icon class="mr-0" small color="#0070c1">mdi-plus</v-icon>See Multiple machines in timeline</a
      >
    </div>
    <div class="filter-wrapper">
      <div class="filter-input">
        <button>
          <v-icon color="#0070c1">mdi-magnify</v-icon>
        </button>
        <input type="text" placeholder="Search anything in the timeline" v-model="filter.query" @keyup="filterChange" />
        <button @click="switchFilter">
          <v-icon color="#0070c1">$svg-settings</v-icon>
        </button>
      </div>
      <div class="filter-actions" v-show="filterOpen">
        <a class="filter-bt">
          <input type="checkbox" id="f_recent" v-model="filter.recent" @change="filterChange" />
          <label for="f_recent">Recent</label>
        </a>
        <a class="filter-bt">
          <input type="checkbox" id="f_jobs" v-model="filter.jobs" @change="filterChange" />
          <label for="f_jobs">Active orders or jobs</label>
        </a>
        <a class="filter-bt">
          <input type="checkbox" id="f_required" v-model="filter.required" @change="filterChange" />
          <label for="f_required">action required</label>
        </a>
        <a class="filter-bt">
          <input type="checkbox" id="f_upcoming" v-model="filter.upcoming" @change="filterChange" />
          <label for="f_upcoming">upcoming</label>
        </a>
        <a class="filter-bt">
          <input type="checkbox" id="f_canceled" v-model="filter.canceled" @change="filterChange" />
          <label for="f_canceled">canceled</label>
        </a>
      </div>
      <div class="clear" v-show="filterOpen" @click="clearFilter"><a>Clear filter</a></div>
    </div>
    <div class="timeline-order">
      <a :class="{ active: isNewest }" @click.prevent="setOrder(true)">Newest</a> /
      <a :class="{ active: !isNewest }" @click.prevent="setOrder(false)">Oldest</a>
    </div>
    <div class="upcoming-events" v-if="jobs.data.length > 0">
      <a class="show-bt" @click.prevent="showJobs = !showJobs"
        >Click to {{ showJobs ? 'close' : 'open' }} upcoming events</a
      >
      <div v-show="showJobs" class="event-wrapper">
        <MaintenanceJob
          v-for="job in jobs.data"
          :value="job"
          :username="username"
          :key="job.id"
          @job-updated="onJobUpdated"
          @job-removed="onJobRemoved"
        ></MaintenanceJob>
      </div>
      <div v-show="showJobs" class="pagination">
        <a :class="{ active: moreEnalbe }" @click.prevent="more">More</a> /
        <a :class="{ active: lessEnable }" @click.prevent="less">Less</a>
      </div>
    </div>
    <div class="timeline-today">
      <div class="today-date">{{ today }}</div>
      <a class="auto-pilot">
        <template v-if="autoPilot">
          <v-icon color="#3bb300" small>$svg-on</v-icon
          ><span title="Click to turn off" @click.prevent="setAutoPilot(false)"
            >Timeline auto pilot is on and helps streamline critical events.</span
          >
        </template>
        <template v-else>
          <v-icon color="#a4a4a4" small>$svg-on</v-icon>
          <span title="Click to turn on" @click.prevent="setAutoPilot(true)">Timeline auto pilot is off.</span>
        </template>
      </a>
    </div>
  </div>
</template>

<script>
  import { debounce } from 'vue-debounce'
  import moment from 'moment'
  import MaintenanceJob from './MaintenanceJob.vue'

  export default {
    name: 'Header',
    components: {
      MaintenanceJob
    },
    props: {
      machine: {
        type: Object,
        default: function() {
          return {}
        }
      },
      username: {
        type: String
      }
    },
    data() {
      return {
        filterOpen: true,
        filter: {
          query: '',
          recent: false,
          jobs: false,
          required: false,
          upcoming: false,
          canceled: false
        },
        isNewest: true,
        today: moment().format('MMM DD, YYYY'),
        showJobs: false,
        jobs: {
          pageIndex: 0,
          pageSize: 10,
          data: []
        }
      }
    },
    computed: {
      autoPilot() {
        return this.machine ? this.machine.autoPilot : false
      },
      vehicleId() {
        return this.machine ? this.machine.vehicleId : null
      },
      moreEnalbe() {
        return (this.jobs.pageIndex - 1) * this.jobs.pageSize + 5 < this.jobs.total
      },
      lessEnable() {
        return this.jobs.data.length > 5
      }
    },
    created() {
      var $this = this
      this.filterChange = debounce(() => {
        console.log($this.filter)
      }, 300)
      this.reloadJobs()
    },
    methods: {
      switchFilter() {
        this.filterOpen = !this.filterOpen
      },
      clearFilter() {
        this.filterOpen = false
        this.filter.query = ''
        this.filter.recent = false
        this.filter.jobs = false
        this.filter.required = false
        this.filter.upcoming = false
        this.filter.canceled = false
        this.filterChange()
        // ajax logic
      },
      setOrder(value) {
        this.isNewest = value
      },
      more() {
        if (this.moreEnalbe) this.getMoreJobs()
      },
      less() {
        if (this.lessEnable) this.getLessJobs()
      },
      setAutoPilot(value) {
        this.$axios
          .post('/Timeline/UpdateAutoPilot', {
            vehicleId: this.vehicleId,
            autoPilot: value
          })
          .then(result => {
            if (result && result.status === 200) {
              this.machine.autoPilot = value
            }
          })
      },
      reloadJobs(model) {
        let pageIndex = 1
        let pageSize = 10
        let vehicleId = this.vehicleId
        var $this = this
        $this.$axios.post('/Timeline/GetMaintenanceJobs', { ...model, vehicleId, pageIndex, pageSize }).then(result => {
          if (result && result.status === 200) {
            $this.jobs = result.data
          }
        })
      },
      getMoreJobs(model) {
        var $this = this
        let pageIndex = this.jobs.pageIndex + 1
        let pageSize = this.jobs.pageSize
        let vehicleId = this.vehicleId
        $this.$axios.post('/Timeline/GetMaintenanceJobs', { ...model, vehicleId, pageIndex, pageSize }).then(result => {
          if (result && result.status === 200) {
            var data = $this.jobs.data.concat(result.data.data)
            $this.jobs = { ...result.data, data }
          }
        })
      },
      getLessJobs() {
        let pageIndex = this.jobs.pageIndex - 1
        let pageSize = this.jobs.pageSize
        let count = pageIndex === 1 ? 5 : 5 + (pageIndex - 1) * pageSize
        let data = this.jobs.data
        data.splice(count, data.length - count)

        let jobs = {
          ...this.jobs,
          pageIndex,
          data
        }
        this.jobs = jobs
      },
      onJobUpdated(job) {
        var data = this.jobs.data
        var index = data.findIndex(x => x.id == job.id)
        data.splice(index, 1, job)
        this.jobs = { ...this.jobs, data }
      },
      onJobRemoved(job) {
        var data = this.jobs.data
        var index = data.findIndex(x => x.id == job.id)
        data.splice(index, 1, job)
        this.jobs = { ...this.jobs, data }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .timeline-header {
    font-size: 14px;

    .actions {
      display: flex;
      justify-content: flex-end;
      font-size: 14px;
      line-height: 16px;
      margin: 5px 0;

      .action-bt {
        display: flex;
        align-items: center;
        text-transform: uppercase;
        cursor: pointer;
        color: #404040;
        .v-icon {
          font-size: 18px;
        }
      }
    }

    .filter-wrapper {
      .filter-input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 5px;
        border-radius: 5px;
        box-shadow: 0px 2px 8px 0px #0003;
        margin-bottom: 10px;

        input {
          border: 0;
          font-size: 13px;
          width: 100%;
          outline: 0;
          margin: 0 10px;
        }
        button {
          display: flex;
          border: 0;
          background: transparent;
          position: relative;
        }
      }

      .filter-actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 5px;
        .filter-bt {
          margin: 0px 8px 5px 0;
          label {
            display: block;
            cursor: pointer;
            line-height: 20px;
            text-transform: uppercase;
            background-color: #a6a6a6;
            border: none;
            color: #fff;
            font-size: 12px;
            padding: 5px 15px;
            border-radius: 5px;
            transition: all 350ms;
          }
          input:checked + label {
            background-color: #000;
          }
          input {
            display: none;
          }
        }
      }

      .clear {
        text-align: right;
        a {
          cursor: pointer;
        }
      }
    }

    .timeline-order {
      a {
        cursor: pointer;
      }
      a.active {
        color: #404040;
        font-weight: bold;
      }
    }

    .timeline-today {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 10px 0;
      position: relative;
      &:after {
        position: absolute;
        content: ' ';
        width: 1px;
        background-color: #0070c1;
        bottom: -10px;
        left: 20px;
        height: 10px;
      }

      .today-date {
        font-weight: bold;
        color: #0070c1;
      }
      .auto-pilot {
        border: none;
        background: none;
        display: flex;
        align-items: center;
        padding: 0;
        font-weight: normal;
      }
    }

    .upcoming-events {
      font-size: 12px;

      .show-bt {
        display: block;
        margin: 5px 0;
      }
      .pagination {
        text-align: right;
        margin: 5px 0;
        .active {
          font-weight: bold;
          color: #404040;
        }
      }
    }
  }
</style>
