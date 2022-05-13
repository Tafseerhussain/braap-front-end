<template>
  <div class="diagnostic-item">
    <div class="event-item line-indicator">
      <div class="event-meta"></div>
      <div class="event-title">
        <div class="content color-40">
          <span
            ><b>Diagnostic:</b> <a class="color-40">{{ diagnostic.name }}</a></span
          >
        </div>
      </div>
      <div class="actions">
        <a class="action" @click.prevent="modify">Modify</a><span> | </span>
        <a class="action" @click.prevent="remove">Remove</a>
      </div>
    </div>

    <div v-if="!showForm" class="event-item line-indicator pt-5">
      <div class="event-meta"></div>
      <div class="event-title">
        <div class="content color-40">
          <v-select
            :items="reasons"
            v-model="reason"
            background-color="#404040"
            label="Select reason"
            solo
            small
          ></v-select>
          <div class="img-wrapper">
            <v-img
              lazy-src="../../../assets/loading.gif"
              max-height="32" contain
              max-width="56"
              src="https://picsum.hotos/id/11/500/300"
            ></v-img>
            <v-file-input dark hide-input prepend-icon="mdi-plus"></v-file-input>
          </div>
          <div class="btn-wrapper">
            <v-btn color="success" small elevation="2" @click="accept">Accept job</v-btn>
            <v-btn color="#a6a6a6" small elevation="2" @click="showDeclineForm = true">Decline</v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'Diagnostic',
    props: {
      diagnostic: {
        type: Object,
        default: function() {
          return {}
        }
      }
    },
    components: {},
    data: function() {
      return {
        showForm: false,
        reasons: ['123123', '234234', 'sdfsdf'],
        reason: null
      }
    },
    created() {},
    watch: {
      diagnostic(value) {
        if (value) {
          console.log(value)
        }
      }
    },
    computed: {},
    methods: {
      moment,
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
      },
      modify() {
        console.log(1)
      },
      remove() {
        console.log(2)
      }
    }
  }
</script>

<style lang="scss">
  .diagnostic-item {
    .event-item {
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

    .img-wrapper {
      display: flex;
      align-items: center;

      .v-image__image--preload {
        filter: none;
      }

      .v-file-input {
        width: 56px;
        height: 32px;
        padding: 0;
        margin: 0;
        color: #FFF;
        flex: none;
        background-color: #404040;
        justify-content: center;
        .v-input__prepend-outer {
          margin: 0;
        }
      }
    }
  }
</style>
