<template>
  <div class="job-detail">
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
        </div>
      </div>
      <div class="actions">
        <a class="action" @click.prevent="postQuestion">Post Question</a>
      </div>
    </div>
    <Diagnostic v-for="d in job.diagnostics" :key="d.id" :diagnostic="d"></Diagnostic>
  </div>
</template>

<script>
  import moment from 'moment'
  import Diagnostic from './Diagnostic.vue'

  export default {
    name: 'DetailedJobAssessment',
    props: {
      job: {
        type: Object,
        default: function() {
          return {}
        }
      }
    },
    components: {
      Diagnostic
    },
    data: function() {
      return {
        showDeclineForm: false
      }
    },
    created() {},
    watch: {
      job(value) {
        if (value) {
          console.log(value)
        }
      }
    },
    computed: {},
    methods: {
      moment
    }
  }
</script>

<style lang="scss">
  .job-detail {
    .event-item {
      align-items: flex-start !important;
      .event-title {
        .content {
          a {
            text-decoration: underline;
          }
        }
      }

      .actions {
        white-space: nowrap;

        .action {
          color: #a4a4a4;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s;
          border-bottom: 1px solid transparent;
          &:hover {
            border-bottom: 1px solid #a4a4a4;
          }
        }
      }
    }
  }
</style>
