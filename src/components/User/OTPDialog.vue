<template>
  <v-dialog
    v-model="dialog"
    max-width="598"
    scrollable
    overlay-color="rgba(0,0,0,0.5)"
    overlay-opacity="1"
    class="elevation-0"
  >
    <v-card class="rounded-10 px-12 py-9 ma-4 mr-8 otp-form">
      <v-card-title class="py-4 px-0">
        <div class="text-h4 braap_orange--text font-weight-bold"><slot name="title"></slot></div>
        <div class="braap-logo d-flex rounded-10 justify-center braap_orange px-6 py-6">
          <v-icon color="primary" class="back-icon">$svg-braap-logo</v-icon>
        </div>
      </v-card-title>
      <p class="subtitle-0 mt-2 mr-14">
        <slot name="msg"></slot>
      </p>
      <v-card-text class="pa-0 py-3 d-flex flex-column">
        <v-otp-input
          v-model="otp"
          color="braap_orange"
          ref="otp"
          length="5"
          class="mx-auto my-8"
          style="max-width: 300px"
          @finish="onFinish"
        ></v-otp-input>
        <div class="d-flex align-center primary--text pt-8">
          Didn’t get a code?<a v-if="counter === 0" class="text-decoration-underline ml-1" @click.prevent="sendAgain"
            >Send Again</a
          ><span v-else class="grey--text ml-1">Send Again ({{ this.counter }}s)</span>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'OTPDialog',
    components: {},
    props: {
      value: {
        type: Boolean,
        required: true
      },
      resendUrl: {
        type: String,
        required: true
      },
      verifyUrl: {
        type: String,
        required: true
      }
    },
    data: function() {
      return {
        dialog: false,
        counter: 0,
        timer: null,
        otp: null
      }
    },
    watch: {
      value(val) {
        this.dialog = val
        if (this.dialog) {
          this.otp = null
          this.$nextTick(() => {
            setTimeout(() => {
              this.$refs.otp.focus()
            }, 500)
          })
        }
      },
      dialog(val) {
        if (val) {
          this.$chat.hide()
          this.$scrollbar_hide()
        } else {
          this.$chat.show()
          this.$scrollbar_show()
        }
        this.$emit('input', val)
      }
    },
    created() {
      if (this.value) this.dialog = this.value
    },
    mounted() {},
    methods: {
      sendAgain() {
        this.startTimer()
        // this.$emit('on-send-code', this)
        this.$axios.post(this.resendUrl).then(result => {
          if (result.success) {
            this.$msg.success('Code sent successfully.')
          } else {
            this.$msg.error('Something went wrong during sending code. Try again...')
            this.counter = 0
            if (this.timer) clearInterval(this.timer)
          }
        })
      },
      startTimer() {
        this.counter = 60
        this.timer = setInterval(() => {
          this.counter = this.counter - 1
          if (this.counter === 0 && this.timer) {
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      },
      closeDialog() {
        this.$emit('input', false)
      },
      onFinish() {
        if (!this.otp) return
        if (this.otp.length < 5) return
        this.$axios.post(`${this.verifyUrl}/${this.otp}`).then(result => {
          if (result.success) {
            this.$emit('finish', this.otp)
          } else {
            this.otp = null
            // this.emailVerify.error = true
            // this.$msg.error(result.data.essage)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .otp-form {
    .braap-logo {
      position: absolute;
      right: -30px;
      top: 40px;
      .back-icon {
        font-size: 78px;
        svg {
          width: 78px;
          height: 78px;
        }
      }
    }
  }
</style>
