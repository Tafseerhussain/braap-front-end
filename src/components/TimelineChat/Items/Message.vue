<template>
  <div class="align-self-start message" style="position: relative">
    <Bubble :timestamp="activity.timestamp" align="left">
      <span class="body-1">{{ formattedMsg }} </span>&nbsp;
      <a v-if="help" class="body-1 white--text" @click="openChat">Get help</a>

      <v-btn v-if="!disabled" light class="close-bt" icon elevation="0" small @click="remove">
        <v-icon light color="braap-grey">mdi-close-circle</v-icon>
      </v-btn>
    </Bubble>
  </div>
</template>

<script>
  import Bubble from './Bubble.vue'
  import moment from 'moment'

  export default {
    name: 'Message',
    props: {
      vehicleId: {
        type: String
      },
      help: {
        type: Boolean
      },
      message: {
        type: String
      },
      meta: {
        type: Object,
        default: () => {}
      },
      activity: {
        type: Object,
        default: () => {}
      },
      disabled: {
        type: Boolean
      }
    },
    components: {
      Bubble
    },
    data: function() {
      return {}
    },
    computed: {
      formattedMsg() {
        if (!this.meta) return this.message
        var data = this.message
        Object.keys(this.meta).forEach(key => {
          let val = this.meta[key]
          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val)) {
            val = moment(val).format('MMMM DD, YYYY')
          }
          data = data.replace('[' + key + ']', val)
        })

        return data
      }
    },
    methods: {
      openChat() {
        window.$('#zsiq_agtpic').click()
        window.$('#zsiq_maintitle').click()

        window.$('#zsiq_byline').click()
      },
      remove() {
        this.$axios
          .post('/Timeline/RemoveMessage', {
            vehicleId: this.vehicleId,
            activityId: this.activity.id
          })
          .then(result => {
            if (result && result.status === 200) {
              this.$emit('change', {
                action: 'remove',
                activity: this.activity
              })
            }
          })
      }
    }
  }
</script>

<style lang="scss">
  .message {
    .close-bt {
      position: absolute !important;
      top: 50%;
      margin-top: -14px;
      right: -30px;
    }
  }
</style>
